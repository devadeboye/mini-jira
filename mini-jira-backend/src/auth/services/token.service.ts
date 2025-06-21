import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { EnvironmentEnum } from '../../config/enums/config.enum';
import { User } from '../../user/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import {
  RefreshTokenPayload,
  TokenPayload,
  Tokens,
} from '../interfaces/tokens.interface';
import type { AuthenticatedUser } from '../types/authenticated-user.type';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(
    user: User | AuthenticatedUser,
    res?: Response,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    if (res) {
      res.cookie('refreshToken', refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });
    }

    return {
      accessToken: accessToken.token,
      accessTokenExpiresIn: accessToken.expires,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        hasCreatedProject: user.hasCreatedProject,
      },
    };
  }

  private generateAccessToken(user: User | AuthenticatedUser): TokenPayload {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(EnvironmentEnum.JWT_SECRET),
      expiresIn:
        this.configService.get<number>(EnvironmentEnum.JWT_EXPIRES_IN)! * 60,
    });

    return {
      token,
      expires: new Date(
        Date.now() +
          this.configService.get<number>(EnvironmentEnum.JWT_EXPIRES_IN)! *
            60 *
            1000,
      ),
    };
  }

  private async generateRefreshToken(
    user: User | AuthenticatedUser,
  ): Promise<TokenPayload> {
    const jti = uuid.v4();
    const payload: RefreshTokenPayload = {
      jti,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(EnvironmentEnum.JWT_SECRET),
      expiresIn: '7d', // Long-lived refresh token
    });

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save refresh token to database
    await this.refreshTokenRepository.save({
      id: jti,
      token,
      userId: user.id,
      expiresAt: expires,
      isRevoked: false,
    });

    return { token, expires };
  }

  async refreshTokens(refreshToken: string, res?: Response): Promise<Tokens> {
    const refreshTokenGracePeriod = this.configService.get<number>(
      EnvironmentEnum.REFRESH_TOKEN_GRACE_PERIOD,
    )!;
    const refreshTokenMaxUsage = this.configService.get<number>(
      EnvironmentEnum.REFRESH_TOKEN_MAX_USAGE,
    )!;

    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>(EnvironmentEnum.JWT_SECRET),
        },
      );

      // Find the token in the database
      const tokenDoc = await this.refreshTokenRepository.findOne({
        where: { id: payload.jti },
        relations: ['user'],
      });

      const inValidRefreshToken =
        !tokenDoc ||
        tokenDoc.isRevoked ||
        tokenDoc.usageCount >= refreshTokenMaxUsage;

      const gracePeriodExceeded =
        tokenDoc && tokenDoc.firstUsedAt
          ? new Date(Date.now() - tokenDoc.firstUsedAt.getTime()) >
            new Date(
              tokenDoc.expiresAt.getTime() + refreshTokenGracePeriod * 1000,
            )
          : false;

      if (inValidRefreshToken || gracePeriodExceeded) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newTokens = await this.generateTokens(tokenDoc.user, res);

      tokenDoc.usageCount++;
      Logger.debug(
        `Refresh token used ${tokenDoc.usageCount} times`,
        'TokenService',
      );
      if (tokenDoc.usageCount >= refreshTokenMaxUsage) {
        tokenDoc.isRevoked = true;
        Logger.debug('Refresh token revoked');
      } else {
        tokenDoc.firstUsedAt = new Date();
        Logger.debug(`Refresh token used ${tokenDoc.usageCount} times`);
      }

      await this.refreshTokenRepository.save(tokenDoc);
      return newTokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshTokensForUser(
    userId: string,
    res?: Response,
  ): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );

    if (res) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }
  }
}

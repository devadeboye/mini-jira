import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { RefreshToken } from '../entities/refresh-token.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import {
  RefreshTokenPayload,
  Tokens,
  TokenPayload,
} from '../interfaces/tokens.interface';
import { User } from '../../user/entities/user.entity';
import { EnvironmentEnum } from '../../config/enums/config.enum';
import type { AuthenticatedUser } from '../types/authenticated-user.type';
import { Response } from 'express';

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
      expiresIn: '15m', // Increased to 15 minutes
    });

    return {
      token,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };
  }

  private async generateRefreshToken(
    user: User | AuthenticatedUser,
  ): Promise<TokenPayload> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const jti = uuid.v4();
    const payload: RefreshTokenPayload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: jti,
      token,
      userId: user.id,
      expiresAt: expires,
      isRevoked: false,
    });

    return { token, expires };
  }

  async refreshTokens(refreshToken: string, res?: Response): Promise<Tokens> {
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

      if (!tokenDoc || tokenDoc.isRevoked || new Date() > tokenDoc.expiresAt) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke the current refresh token
      await this.refreshTokenRepository.update(tokenDoc.id, {
        isRevoked: true,
      });

      // Generate new tokens
      return this.generateTokens(tokenDoc.user, res);
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

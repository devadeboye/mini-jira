import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UserStatus } from '../../user/enums/user.enum';
import { EnvironmentEnum } from '../../config/enums/config.enum';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>(EnvironmentEnum.JWT_SECRET)!;
    Logger.debug(
      `JWT Strategy initialized with secret: ${secret}`,
      JwtStrategy.name,
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    try {
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.logger.debug(`User not found for ID: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }
      if (user.status !== UserStatus.ACTIVE) {
        this.logger.debug(
          `User ${payload.sub} is not active. Status: ${user.status}`,
        );
        throw new UnauthorizedException('User is not active');
      }
      this.logger.debug(`User ${payload.sub} successfully validated`);
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.debug(`Error validating user: ${error.message}`);
      }
      throw error;
    }
  }
}

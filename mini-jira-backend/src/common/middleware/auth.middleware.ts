import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { AuthenticatedRequest } from '../../auth/types/request.type';
import { EnvironmentEnum } from '../../config/enums/config.enum';
import { UserStatus } from '../../user/enums/user.enum';
import { IUserService as UserService } from '../../user/interfaces/user-service.interface';
import { USER_SERVICE_TOKEN } from '../constants/injection-tokens';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: UserService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Skip auth for public routes
      if (this.isPublicRoute(req.path)) {
        return next();
      }

      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify token
      const secret = this.configService.get<string>(
        EnvironmentEnum.JWT_SECRET,
      )!;
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      // Get user and check status
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('User is not active');
      }

      // Attach user to request for use in guards and controllers
      req.user = user;
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicRoute(path: string): boolean {
    const publicPaths = ['/auth/login', '/auth/register', '/auth/refresh'];
    return publicPaths.some((publicPath) => path.startsWith(publicPath));
  }
}

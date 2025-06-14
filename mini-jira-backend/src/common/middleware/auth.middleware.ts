import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UserStatus } from '../../user/enums/user.enum';
import { EnvironmentEnum } from '../../config/enums/config.enum';
import { AuthenticatedRequest } from 'src/auth/types/request.type';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

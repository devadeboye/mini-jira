import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { USER_SERVICE_TOKEN } from '../../common/constants/injection-tokens';
import { ObjectValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { IUserService as UserService } from '../../user/interfaces/user-service.interface';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Tokens } from '../interfaces/tokens.interface';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types/request.type';
import { loginSchema, registerSchema } from '../validators/auth.schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ObjectValidationPipe(registerSchema)) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(registerDto, res);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ObjectValidationPipe(loginSchema)) loginBody: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(
      `Login attempt with username: ${loginBody.username}`,
      'AuthController',
    );

    const user = await this.authService.validateUser(
      loginBody.username,
      loginBody.password,
    );
    return this.authService.login(user, res);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req: { cookies: { refreshToken?: string } },
    @Res({ passthrough: true }) res: Response,
    @Body() body: { refreshToken: string },
  ): Promise<Tokens> {
    const refreshToken = body.refreshToken || req.cookies?.refreshToken;
    this.logger.debug(
      `Refresh token attempt with token: ...${refreshToken?.slice(-15)}`,
      'AuthController',
    );
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.id, res);
    return { message: 'Successfully logged out' };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.id);
  }
}

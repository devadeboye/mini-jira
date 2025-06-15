import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ObjectValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../types/request.type';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body(new ObjectValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ObjectValidationPipe(loginSchema)) loginBody: LoginDto,
  ) {
    this.logger.log(
      `Login attempt with username: ${loginBody.username}`,
      'AuthController',
    );

    const user = await this.authService.validateUser(
      loginBody.username,
      loginBody.password,
    );
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: AuthenticatedRequest) {
    await this.authService.logout(req.user.id);
    return { message: 'Successfully logged out' };
  }
}

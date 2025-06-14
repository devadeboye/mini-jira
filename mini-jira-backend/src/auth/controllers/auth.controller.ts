import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UsePipes,
  Logger,
  Body,
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
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ObjectValidationPipe(registerSchema))
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ObjectValidationPipe(loginSchema))
  async login(@Body() loginBody: LoginDto) {
    Logger.log(
      `Login attempt with username: ${loginBody.username}`,
      'AuthController',
    );

    const user = await this.authService.validateUser(
      loginBody.username,
      loginBody.password,
    );
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Request() req: AuthenticatedRequest) {
    return this.authService.refreshToken(req.user);
  }
}

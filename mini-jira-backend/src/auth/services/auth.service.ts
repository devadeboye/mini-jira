import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../user/services/password.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserStatus } from '../../user/enums/user.enum';
import { UserService } from '../../user/services/user.service';
import type { AuthenticatedUser } from '../types/authenticated-user.type';
import type { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if username or email already exists
    const existingUser = await this.userService.findByUsernameOrEmail(
      registerDto.username,
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Create new user
    const user = await this.userService.create(registerDto);

    // Return tokens and user info
    return this.login(user);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.userService.findByUsername(username, true);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordService.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }

    // Update last login
    await this.userService.updateLastLogin(user.id);

    // Create authenticated user instance
    const { ...publicFields } = user;
    return {
      ...publicFields,
      updateLastActivity: () => {
        this.userService.updateLastActivity(user.id);
      },
    };
  }

  login(user: AuthenticatedUser) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    };
  }

  refreshToken(user: AuthenticatedUser) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

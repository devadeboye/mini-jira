import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../user/services/password.service';
import { UserService } from '../../user/services/user.service';
import { TokenService } from './token.service';
import { UserStatus } from '../../user/enums/user.enum';
import type { AuthenticatedUser } from '../types/authenticated-user.type';
import type { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
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
    const tokens = await this.tokenService.generateTokens(user);
    return {
      ...tokens,
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

  async login(user: AuthenticatedUser) {
    const tokens = await this.tokenService.generateTokens(user);
    return {
      ...tokens,
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

  async refreshTokens(refreshToken: string) {
    return this.tokenService.refreshTokens(refreshToken);
  }

  async logout(userId: string) {
    await this.tokenService.revokeRefreshTokensForUser(userId);
  }
}

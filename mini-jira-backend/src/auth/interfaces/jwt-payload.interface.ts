import { UserRole } from '../../user/enums/user.enum';

export interface JwtPayload {
  sub: string; // User ID
  username: string;
  email: string;
  role: UserRole;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

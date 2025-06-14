import type { User } from '../../user/entities/user.entity';

export type AuthenticatedUser = Omit<User, 'password' | 'salt'> & {
  updateLastActivity(): void;
};

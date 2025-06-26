import { Response } from 'express';
import { User } from '../../user/entities/user.entity';
import type { AuthenticatedUser } from '../types/authenticated-user.type';
import { Tokens } from './tokens.interface';

export interface ITokenService {
  /**
   * Generates access and refresh tokens for a user
   * @param user - The user to generate tokens for
   * @param res - Optional Express response object to set cookies
   * @returns Promise resolving to token information
   */
  generateTokens(
    user: User | AuthenticatedUser,
    res?: Response,
  ): Promise<Tokens>;

  /**
   * Refreshes access and refresh tokens using a valid refresh token
   * @param refreshToken - The refresh token to use
   * @param res - Optional Express response object to set cookies
   * @returns Promise resolving to new token information
   */
  refreshTokens(refreshToken: string, res?: Response): Promise<Tokens>;

  /**
   * Revokes all refresh tokens for a specific user
   * @param userId - The ID of the user whose tokens should be revoked
   * @param res - Optional Express response object to clear cookies
   * @returns Promise that resolves when tokens are revoked
   */
  revokeRefreshTokensForUser(userId: string, res?: Response): Promise<void>;
}

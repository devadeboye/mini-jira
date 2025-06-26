import type { RegisterDto } from '../../auth/dto/register.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  /**
   * Finds a user by their ID
   * @param id - The user ID to search for
   * @returns Promise resolving to the user
   * @throws NotFoundException if user is not found
   */
  findByIdAndErrorOut(id: string): Promise<User>;

  /**
   * Finds a user by their ID
   * @param id - The user ID to search for
   * @returns Promise resolving to the user
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their username
   * @param username - The username to search for
   * @param includePassword - Whether to include password and salt in the result
   * @returns Promise resolving to the user or null if not found
   */
  findByUsername(
    username: string,
    includePassword?: boolean,
  ): Promise<User | null>;

  /**
   * Finds a user by their username or email
   * @param username - The username to search for
   * @param email - The email to search for
   * @returns Promise resolving to the user or null if not found
   */
  findByUsernameOrEmail(username: string, email: string): Promise<User | null>;

  /**
   * Creates a new user
   * @param registerDto - The user registration data
   * @returns Promise resolving to the created user
   */
  create(registerDto: RegisterDto): Promise<User>;

  /**
   * Updates the last login timestamp for a user
   * @param id - The user ID to update
   * @returns Promise that resolves when the update is complete
   */
  updateLastLogin(id: string): Promise<void>;

  /**
   * Updates the last activity timestamp for a user
   * @param id - The user ID to update
   * @returns Promise that resolves when the update is complete
   */
  updateLastActivity(id: string): Promise<void>;
}

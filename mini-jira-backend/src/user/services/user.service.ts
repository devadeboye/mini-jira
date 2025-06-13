import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordService } from './password.service';
import type { RegisterDto } from '../../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(
    username: string,
    includePassword = false,
  ): Promise<User | null> {
    const query = this.userRepository.createQueryBuilder('user');

    if (includePassword) {
      query.addSelect(['user.password', 'user.salt']);
    }

    return query.where('user.username = :username', { username }).getOne();
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username,
        email,
      })
      .getOne();
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const { hash: password, salt } = await this.passwordService.hash(
      registerDto.password,
    );

    const user = this.userRepository.create({
      ...registerDto,
      password,
      salt,
    });

    return this.userRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  updateLastActivity(id: string): void {
    this.userRepository.update(id, {
      lastActivityAt: new Date(),
    });
  }
}

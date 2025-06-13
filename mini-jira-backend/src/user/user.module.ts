import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { PasswordService } from './services/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, PasswordService],
  exports: [TypeOrmModule, UserService, PasswordService],
})
export class UserModule {}

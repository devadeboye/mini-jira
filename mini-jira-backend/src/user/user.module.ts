import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_SERVICE_TOKEN } from '../common/constants/injection-tokens';
import { User } from './entities/user.entity';
import { PasswordService } from './services/password.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService,
    },
    PasswordService,
  ],
  exports: [TypeOrmModule, USER_SERVICE_TOKEN, PasswordService],
})
export class UserModule {}

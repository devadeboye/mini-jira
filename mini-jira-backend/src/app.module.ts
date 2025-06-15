import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { WorkItemModule } from './work-item/work-item.module';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';
import { Sprint } from './sprint/entities/sprint.entity';
import { WorkItem } from './work-item/entities/work-item.entity';
import { AuthModule } from './auth/auth.module';
import { environmentValidator } from './config/env.validator';
import { EnvironmentEnum } from './config/enums/config.enum';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './auth/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: environmentValidator,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(EnvironmentEnum.TYPEORM_HOST),
        port: configService.get(EnvironmentEnum.TYPEORM_PORT),
        username: configService.get(EnvironmentEnum.TYPEORM_USERNAME),
        password: configService.get(EnvironmentEnum.TYPEORM_PASSWORD),
        database: configService.get(EnvironmentEnum.TYPEORM_DATABASE),
        entities: [User, Project, Sprint, WorkItem, RefreshToken],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        synchronize: configService.get(EnvironmentEnum.TYPEORM_SYNCHRONIZE),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProjectModule,
    SprintModule,
    WorkItemModule,
    AuthModule,
  ],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/auth/login', '/auth/register', '/auth/refresh')
      .forRoutes('*');
  }
}

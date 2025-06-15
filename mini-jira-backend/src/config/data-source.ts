import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { WorkItem } from '../work-item/entities/work-item.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { EnvironmentEnum } from './enums/config.enum';

// Load environment variables
(config as () => void)();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env[EnvironmentEnum.TYPEORM_HOST],
  port: parseInt(process.env[EnvironmentEnum.TYPEORM_PORT] || '5432', 10),
  username: process.env[EnvironmentEnum.TYPEORM_USERNAME],
  password: process.env[EnvironmentEnum.TYPEORM_PASSWORD],
  database: process.env[EnvironmentEnum.TYPEORM_DATABASE],
  entities: [User, Project, Sprint, WorkItem, RefreshToken],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env[EnvironmentEnum.TYPEORM_SYNCHRONIZE] === 'true',
};

export const AppDataSource = new DataSource(options);

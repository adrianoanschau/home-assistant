import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { EstimatedIncomeEntity, UserEntity } from './src/database/entities';
import { CreateUser1673922039963 } from './migrations/1673922039963-CreateUser';
import { CreateEstimatedIncome1673922204915 } from './migrations/1673922204915-CreateEstimatedIncome';

const ENV = process.env.NODE_ENV;

config({
  path: !ENV ? '.env' : `.env.${ENV}`,
});

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [UserEntity, EstimatedIncomeEntity],
  migrations: [CreateUser1673922039963, CreateEstimatedIncome1673922204915],
});

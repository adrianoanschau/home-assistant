import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Initial1674151832936 } from './migrations';
import { EstimatedEntryEntity, EntryEntity } from './src/database/entities';

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
  entities: [EstimatedEntryEntity, EntryEntity],
  migrations: [Initial1674151832936],
});

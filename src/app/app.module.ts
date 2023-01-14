import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JsonapiModule } from 'nest-jsonapi';
import { AdminJsModule } from '../admin-js/admin-js.module';
import configuration from '../config';
import { IncomeEntity, UserEntity } from '../database/entities';
import { DatabaseModule } from '../database/database.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [UserEntity, IncomeEntity],
      }),
      inject: [ConfigService],
    }),
    JsonapiModule.forRoot({
      mountPoint: '/api',
    }),
    DatabaseModule,
    AdminJsModule,
  ],
})
export class AppModule {}

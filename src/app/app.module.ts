import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JsonapiModule } from 'nest-jsonapi';
import { AdminJsModule } from '../admin-js/admin-js.module';
import { EstimatedIncomeEntity, UserEntity } from '../database/entities';
import { DatabaseModule } from '../database/database.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        // entities: [UserEntity, EstimatedIncomeEntity],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    JsonapiModule.forRoot({
      mountPoint: '/api',
    }),
    DatabaseModule,
    // AdminJsModule,
  ],
})
export class AppModule {}

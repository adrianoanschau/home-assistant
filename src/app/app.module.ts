import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JsonapiMiddleware,
  JsonapiModule,
  JsonapiService,
  JSONAPI_MODULE_SERVICE,
  SchemaBuilder,
} from 'nest-jsonapi';
import { TransactionsReturn as TransactionsResource } from 'belvo';
import { AdminJsModule } from '../admin-js/admin-js.module';
import { DatabaseModule } from '../database/database.module';
import { OpenFinanceModule } from '../open-finance/open-finance.module';
import { TransactionsController } from './transactions/transactions.controller';
import { IntegrationsService } from './integrations/integrations.service';
import { IntegrationsController } from './integrations/integrations.controller';
import {
  EntriesController,
  EstimatedController,
  UsersController,
} from '../database/controllers';
import { EntryResource } from '../database/types/entry.resource';
import { IntegrationResource } from './types/integration.resource';
import { EstimatedResource } from '../database/types/estimated.resource';
import { EntryEntity } from '../database/entities';

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
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([EntryEntity]),
    JsonapiModule.forRoot({
      mountPoint: '/api',
    }),
    DatabaseModule,
    AdminJsModule,
    OpenFinanceModule,
  ],
  controllers: [TransactionsController, IntegrationsController],
  providers: [IntegrationsService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    @Inject(JSONAPI_MODULE_SERVICE)
    private readonly jsonapiService: JsonapiService,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JsonapiMiddleware)
      .forRoutes(
        EntriesController,
        EstimatedController,
        UsersController,
        IntegrationsController,
        TransactionsController,
      );
  }

  public async onModuleInit(): Promise<void> {
    this.jsonapiService.register(new SchemaBuilder<EntryResource>('entry'));
    this.jsonapiService.register(
      new SchemaBuilder<EstimatedResource>('estimated'),
    );
    this.jsonapiService.register(
      new SchemaBuilder<IntegrationResource>('integration'),
    );
    this.jsonapiService.register(
      new SchemaBuilder<TransactionsResource>('transaction'),
    );
  }
}

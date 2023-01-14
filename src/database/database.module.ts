import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  JsonapiMiddleware,
  JsonapiService,
  JSONAPI_MODULE_SERVICE,
  SchemaBuilder,
} from 'nest-jsonapi';
import { IncomesController } from './controllers/users/incomes.controller';
import { UsersController } from './controllers/users/users.controller';
import { IncomeEntity, UserEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IncomeEntity])],
  controllers: [UsersController, IncomesController],
})
export class DatabaseModule implements NestModule, OnModuleInit {
  constructor(
    @Inject(JSONAPI_MODULE_SERVICE)
    private readonly jsonapiService: JsonapiService,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JsonapiMiddleware)
      .forRoutes(UsersController, IncomesController);
  }

  public async onModuleInit(): Promise<void> {
    this.jsonapiService.register(new SchemaBuilder<UserEntity>('users'));
    this.jsonapiService.register(new SchemaBuilder<IncomeEntity>('incomes'));
  }
}

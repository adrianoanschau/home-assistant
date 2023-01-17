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
import { EstimatedIncomesController } from './controllers/users/incomes.controller';
import { UsersController } from './controllers/users/users.controller';
import { EstimatedIncomeEntity, UserEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EstimatedIncomeEntity])],
  controllers: [UsersController, EstimatedIncomesController],
})
export class DatabaseModule implements NestModule, OnModuleInit {
  constructor(
    @Inject(JSONAPI_MODULE_SERVICE)
    private readonly jsonapiService: JsonapiService,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JsonapiMiddleware)
      .forRoutes(UsersController, EstimatedIncomesController);
  }

  public async onModuleInit(): Promise<void> {
    this.jsonapiService.register(new SchemaBuilder<UserEntity>('users'));
    this.jsonapiService.register(
      new SchemaBuilder<EstimatedIncomeEntity>('estimated_incomes'),
    );
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntriesController,
  EstimatedController,
  UsersController,
} from './controllers';
import { EntryEntity, EstimatedEntryEntity, UserEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntryEntity, EstimatedEntryEntity, UserEntity]),
  ],
  controllers: [EntriesController, EstimatedController, UsersController],
})
export class DatabaseModule {}

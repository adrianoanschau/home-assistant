import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsOptional, IsString } from 'class-validator';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

class FindOptions {
  @IsString()
  @IsOptional()
  public readonly q: string;

  @IsOptional()
  @IsString({ each: true })
  public readonly id: string[];
}

@UseInterceptors(JsonapiInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  @JsonapiPayload({ resource: 'users' })
  @Get()
  public async findUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
}

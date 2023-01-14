import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { Repository } from 'typeorm';
import { IncomeEntity } from '../../entities';

@UseInterceptors(JsonapiInterceptor)
@Controller('incomes')
export class IncomesController {
  constructor(
    @InjectRepository(IncomeEntity)
    private readonly incomesRepository: Repository<IncomeEntity>,
  ) {}

  @JsonapiPayload({ resource: 'incomes' })
  @Get()
  public async findIncomes(): Promise<IncomeEntity[]> {
    return this.incomesRepository.find();
  }
}

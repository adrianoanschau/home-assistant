import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { Repository } from 'typeorm';
import { EstimatedIncomeEntity } from '../../entities';

@UseInterceptors(JsonapiInterceptor)
@Controller('estimated_incomes')
export class EstimatedIncomesController {
  constructor(
    @InjectRepository(EstimatedIncomeEntity)
    private readonly incomesRepository: Repository<EstimatedIncomeEntity>,
  ) {}

  @JsonapiPayload({ resource: 'estimated_incomes' })
  @Get()
  public async findIncomes(): Promise<EstimatedIncomeEntity[]> {
    return this.incomesRepository.find();
  }
}

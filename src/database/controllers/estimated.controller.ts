import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { EstimatedEntryEntity } from '../entities';
import { FindType } from '../types/find-type.dto';

setDefaultOptions({ locale: ptBR });

@UseInterceptors(JsonapiInterceptor)
@Controller('estimated')
export class EstimatedController {
  constructor(
    @InjectRepository(EstimatedEntryEntity)
    private readonly estimatedEntryRepository: Repository<EstimatedEntryEntity>,
  ) {}

  @JsonapiPayload({ resource: 'estimated' })
  @Get()
  public findAll(@Query() { type }: FindType) {
    return from(
      this.estimatedEntryRepository.find({
        where: { type },
      }),
    );
  }
}

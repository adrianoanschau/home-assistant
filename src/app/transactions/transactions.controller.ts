import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { map } from 'rxjs';
import { Repository, Not, IsNull } from 'typeorm';
import { EntryEntity } from '../../database/entities';
import { TransactionsService } from '../../open-finance/transactions/transactions.service';
import { FiltersQuery } from './filters-query.dto';

@UseInterceptors(JsonapiInterceptor)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly nubankService: TransactionsService,
    @InjectRepository(EntryEntity)
    private readonly entryRepository: Repository<EntryEntity>,
  ) {}

  @JsonapiPayload({ resource: 'transaction' })
  @Get('list')
  public async list(
    @Query()
    { fields, account, date_range, type, status }: FiltersQuery,
  ) {
    const entries = await this.entryRepository
      .find({
        where: {
          transaction: Not(IsNull()),
        },
      })
      .then((transactions) =>
        transactions.map(({ transaction }) => transaction),
      );

    return this.nubankService
      .transactions(account, { type, status, date_range, fields })
      .list()
      .pipe(
        map((transactions) =>
          transactions.map((transaction) => ({
            ...transaction,
            integrated: entries.includes(transaction.id),
          })),
        ),
      );
  }
}

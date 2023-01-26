import { Module } from '@nestjs/common';
import { OpenFinanceService } from './open-finance.service';
import { TransactionsService } from './transactions/transactions.service';

@Module({
  providers: [OpenFinanceService, TransactionsService],
  exports: [TransactionsService],
})
export class OpenFinanceModule {}

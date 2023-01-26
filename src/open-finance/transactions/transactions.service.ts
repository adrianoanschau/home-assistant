import { Injectable } from '@nestjs/common';
import { switchMap, catchError } from 'rxjs';
import { isBefore, parse } from 'date-fns';
import { TransactionsReturn } from 'belvo';
import { OpenFinanceService } from '../open-finance.service';
import * as nubankConfig from '../../../credentials/nubank.json';
import { Accounts } from '../../app/types/accounts.enum';
import { Type } from '../../app/types/type.enum';
import { Status } from '../../app/types/status.enum';

type Options = {
  fields: string[];
  date_range?: string;
  type?: Type;
  status?: Status;
};

@Injectable()
export class TransactionsService {
  constructor(private readonly openFinanceService: OpenFinanceService) {}

  public transactions(account: Accounts, options?: Options) {
    return {
      list: this.list(account, options),
    };
  }

  private list(account: Accounts, options?: Options) {
    const { type, status, fields, date_range } = options;

    return () =>
      this.openFinanceService.transactions.pipe(
        switchMap((transactions) =>
          transactions
            .list({
              filters: {
                link: nubankConfig[account].link,
                account: nubankConfig[account].account,
                value_date__range: date_range,
                // credit_card_data__bill_name: bill_name,
                type,
                status,
              },
            })
            .then((transactions) =>
              transactions
                .sort((a, b) => {
                  const firstDate = parse(
                    a.value_date,
                    'yyyy-MM-dd',
                    new Date(),
                  );
                  const lastDate = parse(
                    b.value_date,
                    'yyyy-MM-dd',
                    new Date(),
                  );
                  if (isBefore(firstDate, lastDate)) return 1;
                  if (isBefore(lastDate, firstDate)) return -1;
                  return 0;
                })
                .map((transaction) =>
                  Object.keys(transaction)
                    .filter((field) =>
                      fields
                        .concat('id', 'internal_identification')
                        .includes(field),
                    )
                    .reduce((cur, key) => {
                      return Object.assign(cur, { [key]: transaction[key] });
                    }, {} as TransactionsReturn),
                )
                .map(({ internal_identification, ...transaction }) => ({
                  ...transaction,
                  id: internal_identification,
                })),
            ),
        ),
        catchError((error) => {
          console.log({ error });
          throw Error;
        }),
      );
  }
}

import { Injectable } from '@nestjs/common';
import Belvo from 'belvo';
import { from, of, switchMap } from 'rxjs';
import * as openFinanceConfig from '../../credentials/open-finance.json';

@Injectable()
export class OpenFinanceService {
  private readonly belvo: Belvo;

  constructor() {
    this.belvo = new Belvo(
      openFinanceConfig.secretId,
      openFinanceConfig.secretPassword,
      openFinanceConfig.baseUrl,
    );
  }

  private get connect() {
    return from(this.belvo.connect());
  }

  public get transactions() {
    return this.connect.pipe(switchMap(() => of(this.belvo.transactions)));
  }
}

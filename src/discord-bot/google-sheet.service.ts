import { Injectable } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as CREDENTIALS from './google-api/credentials.json';
import * as FILES from './google-api/files.json';

@Injectable()
export class GoogleSheetService {
  private doc: GoogleSpreadsheet;

  constructor() {
    this.doc = new GoogleSpreadsheet(FILES.sheetId);
    this.setup();
  }

  async setup() {
    await this.doc.useServiceAccountAuth({
      client_email: CREDENTIALS.client_email,
      private_key: CREDENTIALS.private_key.replace(/\\n/g, '\n'),
    });
    await this.doc.loadInfo();
    console.log('Google Sheet Ready!');
  }

  async write() {
    const sheet = this.doc.sheetsByIndex[0];
    sheet
      .addRow({
        nome: 'João Victor',
        idade: 21,
        email: 'joao@medium.com',
      })
      .then(() => {
        console.log('dado salvo!');
      });
  }
}

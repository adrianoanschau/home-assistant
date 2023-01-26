import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { Accounts, AccountsNames } from '../types/accounts.enum';
import { IntegrationResource } from '../types/integration.resource';

@UseInterceptors(JsonapiInterceptor)
@Controller('integrations')
export class IntegrationsController {
  @JsonapiPayload({ resource: 'integration' })
  @Get()
  public list() {
    return Object.keys(Accounts).map(
      (id) =>
        ({
          id,
          name: AccountsNames[id],
        } as IntegrationResource),
    );
  }
}

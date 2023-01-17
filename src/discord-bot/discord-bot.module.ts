import { Module } from '@nestjs/common';
import { GatewayIntentBits } from 'discord.js';
import { NecordModule } from 'necord';
import { AppUpdate } from './app.update';
import { GoogleSheetService } from './google-sheet.service';

@Module({
  imports: [
    NecordModule.forRoot({
      token:
        'MTA2MzE2ODc4NjUwNjcyMzM2OQ.GaY-EX.6VipkrA28Nsmsu1RXYEcN7yF_97Hqtq-PiLYcU',
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
      ],
      development: ['1053272627617206282'],
    }),
  ],
  providers: [GoogleSheetService, AppUpdate],
})
export class AppModule {}

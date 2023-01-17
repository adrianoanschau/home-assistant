import { Injectable, Logger } from '@nestjs/common';
import {
  Context,
  On,
  Once,
  ContextOf,
  SlashCommand,
  SlashCommandContext,
} from 'necord';
import { Client } from 'discord.js';
import { GoogleSheetService } from './google-sheet.service';

@Injectable()
export class AppUpdate {
  private readonly logger = new Logger(AppUpdate.name);

  public constructor(
    private readonly client: Client,
    private readonly sheetService: GoogleSheetService,
  ) {}

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @SlashCommand({
    name: 'ping',
    description: 'Ping command!',
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    await this.sheetService.write();
    return interaction.reply({ content: 'Pong!' });
  }
}

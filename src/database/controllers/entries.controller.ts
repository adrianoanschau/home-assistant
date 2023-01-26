import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import {
  setDefaultOptions,
  endOfMonth,
  endOfYear,
  getMonth,
  setMonth,
  startOfMonth,
  startOfYear,
  parse,
  format,
  addHours,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { JsonapiInterceptor, JsonapiPayload } from 'nest-jsonapi';
import { Between, IsNull, Repository } from 'typeorm';
import { SaveEntry } from '../types/save-entry.dto';
import { EntryEntity, EstimatedEntryEntity } from '../entities';
import { EntryResource } from '../types/entry.resource';
import { CurrentYear } from '../../decorators/get-year.decorator';
import { FindType } from '../types/find-type.dto';
import { RealizedEntry } from '../types/realized-entry.dto';
import { ImportEntry } from '../types/import-entry.dto';

setDefaultOptions({ locale: ptBR });

@UseInterceptors(JsonapiInterceptor)
@Controller('entries')
export class EntriesController {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entryRepository: Repository<EntryEntity>,
    @InjectRepository(EstimatedEntryEntity)
    private readonly estimatedEntryRepository: Repository<EstimatedEntryEntity>,
  ) {}

  @JsonapiPayload({ resource: 'entry' })
  @Get()
  public async findAll(
    @Query() { type }: FindType,
    @CurrentYear() year: number,
  ) {
    const estimatedEntries = await this.estimatedEntryRepository.find({
      where: {
        year,
        type,
      },
      relations: ['entries'],
    });

    const entries = await this.entryRepository.find({
      where: {
        ['estimated_entry']: IsNull(),
        type,
        date: Between(
          startOfYear(new Date(year, 0, 1)),
          endOfYear(new Date(year, 0, 1)),
        ),
      },
    });

    return estimatedEntries
      .map((estimatedEntry) =>
        this.estimatedEntryToResource(
          estimatedEntry,
          estimatedEntry.entries,
          year,
        ),
      )
      .concat(entries.map((entry) => this.entryToResource(entry, year)));
  }

  @JsonapiPayload({ resource: 'entry' })
  @Post('save')
  public async save(
    @Body() { id, field, value }: SaveEntry,
    @CurrentYear() year: number,
  ) {
    const estimatedEntry = await this.estimatedEntryRepository.findOne({
      where: { id },
    });

    const entry = await this.entryRepository.findOne({
      where: { id },
    });

    if (!estimatedEntry && !entry) {
      throw new NotFoundException();
    }

    if (entry) return this.saveNormal(entry, { field, value, id }, year);

    return this.saveEstimated(estimatedEntry, { field, value, id }, year);
  }

  @JsonapiPayload({ resource: 'entry' })
  @Put('realized')
  public async realized(
    @Body() { id, field }: RealizedEntry,
    @CurrentYear() year: number,
  ) {
    const month = getMonth(parse(field, 'LLL', new Date()));
    const date = new Date(year, month, 1);

    const entry = await this.entryRepository.findOne({
      where: { id, date: Between(startOfMonth(date), endOfMonth(date)) },
    });

    if (!entry) {
      throw new NotFoundException();
    }

    entry.realized = true;
    await entry.save();

    return this.findOneEntry(id, year);
  }

  @JsonapiPayload({ resource: 'entry' })
  @Post('import')
  public async import(
    @Body()
    {
      estimated_id,
      transaction_id,
      type,
      value,
      description,
      date: importDate,
    }: ImportEntry,
  ) {
    const date = new Date(importDate);

    return this.entryToResource(
      await this.entryRepository
        .create({
          estimated_entry: {
            id: estimated_id,
          },
          transaction: transaction_id,
          realized: true,
          description,
          value,
          type,
          date: addHours(date, 8),
        })
        .save(),
      date.getFullYear(),
    );
  }

  protected async saveNormal(
    entry: EntryEntity,
    { id, field, value }: SaveEntry,
    year: number,
  ) {
    let entryId = id;

    const month = getMonth(parse(field, 'LLL', new Date()));

    if (getMonth(entry.date) === month) {
      entry.value = value;
      await entry.save();
    } else {
      const insert = await this.entryRepository
        .create({
          description: entry.description,
          date: setMonth(entry.date, month),
          value,
        })
        .save();

      entryId = insert.id;
    }

    return this.findOneEntry(entryId, year);
  }

  protected async saveEstimated(
    estimatedEntry: EstimatedEntryEntity,
    { id, field, value }: SaveEntry,
    year: number,
  ) {
    let entryId = id;
    const month = getMonth(parse(field, 'LLL', new Date()));
    const date = new Date(year, month, estimatedEntry.day);

    const existent = await this.entryRepository.findOne({
      where: {
        estimated_entry: { id },
        date: Between(startOfMonth(date), endOfMonth(date)),
      },
    });

    entryId = existent?.id;

    if (existent) {
      existent.value = value;
      await existent.save();
    } else {
      const insert = await this.entryRepository
        .create({
          estimated_entry: { id },
          type: estimatedEntry.type,
          date,
          value,
        })
        .save();
      entryId = insert.id;
    }

    return this.findOneEstimatedByEntry(entryId, year);
  }

  protected estimatedEntryToResource(
    estimatedEntry: EstimatedEntryEntity,
    entries: EntryEntity[],
    year: number,
  ): EntryResource {
    const incomes = entries.reduce((prev, curr) => {
      const month = format(curr.date, 'LLL');

      return {
        ...prev,
        [month]: {
          entryId: prev[month]?.entryId ?? curr.id,
          estimated: estimatedEntry.estimated,
          value: (prev[month]?.value ?? 0) + curr.value,
          realized: curr.realized,
        },
      };
    }, {});

    const estimatedValues = [
      ...Array(estimatedEntry.month_end - estimatedEntry.month_start + 1),
    ]
      .map((_, i) => estimatedEntry.month_start + i)
      .reduce((prev, curr) => {
        prev[format(new Date(year, curr - 1, 1), 'LLL')] = {
          estimated: estimatedEntry.estimated,
          realized: false,
        };
        return prev;
      }, {});

    return {
      id: estimatedEntry.id,
      description: estimatedEntry.description,
      year,
      ...estimatedValues,
      ...incomes,
    };
  }

  protected entryToResource(entry: EntryEntity, year: number): EntryResource {
    const month = format(entry.date, 'LLL');

    return {
      id: entry.id,
      description: entry.description,
      [month]: {
        entryId: entry.id,
        value: entry.value,
        realized: entry.realized,
        estimated: false,
      },
      year,
    };
  }

  protected async findOneEntry(id: string, year: number) {
    return this.entryToResource(
      await this.entryRepository.findOne({
        where: { id },
      }),
      year,
    );
  }

  protected async findOneEstimatedByEntry(id: string, year: number) {
    const entry = await this.entryRepository.findOne({
      where: { id },
      relations: ['estimated_entry.entries'],
    });

    return this.estimatedEntryToResource(
      entry.estimated_entry,
      entry.estimated_entry.entries,
      year,
    );
  }
}

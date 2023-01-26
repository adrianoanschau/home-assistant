import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EntryType } from './entry-type.enum';

export class ImportEntry {
  @IsOptional()
  @IsUUID()
  estimated_id?: string;

  @IsUUID()
  transaction_id: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EntryType)
  type: EntryType;

  @IsNumber()
  value: number;

  @IsDateString()
  date: Date;
}

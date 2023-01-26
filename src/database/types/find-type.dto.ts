import { IsEnum, IsOptional } from 'class-validator';
import { EntryType } from './entry-type.enum';

export class FindType {
  @IsOptional()
  @IsEnum(EntryType)
  type: EntryType;
}

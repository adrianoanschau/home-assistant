import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Accounts } from '../types/accounts.enum';
import { Status } from '../types/status.enum';
import { Type } from '../types/type.enum';

export class FiltersQuery {
  @IsEnum(Accounts)
  account: Accounts;

  @IsArray()
  fields: string[];

  @IsOptional()
  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsString()
  date_range?: string;
}

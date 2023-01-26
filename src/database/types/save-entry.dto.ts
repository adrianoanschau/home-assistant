import { IsNumber, IsString, IsUUID } from 'class-validator';

export class SaveEntry {
  @IsUUID()
  id: string;

  @IsString()
  field: string;

  @IsNumber()
  value: number;
}

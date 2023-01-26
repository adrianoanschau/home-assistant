import { IsString, IsUUID } from 'class-validator';

export class RealizedEntry {
  @IsUUID()
  id: string;

  @IsString()
  field: string;
}

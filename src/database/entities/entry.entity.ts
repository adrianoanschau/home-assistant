import {
  Entity,
  ManyToOne,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsUUID } from 'class-validator';
import { EntryType } from '../types/entry-type.enum';
import { EstimatedEntryEntity } from './estimated-entry.entity';

@Entity({ name: 'Entry' })
export class EntryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: EntryType,
  })
  type: EntryType;

  @Column({ type: 'timestamptz' })
  @IsDate()
  date: Date;

  @Column({ type: 'float' })
  @IsNumber()
  value: number;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  realized: boolean;

  @Column({ type: 'uuid', nullable: true })
  @IsUUID()
  transaction?: string;

  @ManyToOne(
    () => EstimatedEntryEntity,
    (estimated_entry) => estimated_entry.entries,
  )
  estimated_entry: EstimatedEntryEntity;
}

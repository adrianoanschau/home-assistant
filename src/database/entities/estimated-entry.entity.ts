import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt, IsNumber } from 'class-validator';
import { EntryEntity } from './entry.entity';
import { EntryType } from '../types/entry-type.enum';

@Entity({ name: 'EstimatedEntry' })
export class EstimatedEntryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: EntryType,
  })
  type: EntryType;

  @Column()
  @IsInt()
  year: number;

  @Column()
  @IsInt()
  day: number;

  @Column({ default: 1 })
  @IsInt()
  month_start: number;

  @Column({ default: 12 })
  @IsInt()
  month_end: number;

  @Column({ type: 'float' })
  @IsNumber()
  estimated: number;

  @OneToMany(() => EntryEntity, (income) => income.estimated_entry)
  entries: EntryEntity[];
}

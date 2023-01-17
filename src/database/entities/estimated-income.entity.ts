import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsInt } from 'class-validator';

enum IncomeType {
  MONTHLY = 'monthly',
  UNIQUE = 'unique',
}

@Entity({ name: 'estimated_incomes' })
export class EstimatedIncomeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  description: string;

  @Column()
  @IsEnum(IncomeType)
  type: IncomeType;

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

  @Column()
  @IsInt()
  estimated: number;
}

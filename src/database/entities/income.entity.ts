import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsDateString } from 'class-validator';

@Entity({ name: 'incomes' })
export class IncomeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  description: string;

  @Column()
  @IsDateString()
  date: string;

  @Column()
  @IsInt()
  foreseen: number;

  @Column({ nullable: true })
  @IsInt()
  value: number;
}

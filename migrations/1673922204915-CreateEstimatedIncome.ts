import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEstimatedIncome1673922204915 implements MigrationInterface {
  name = 'CreateEstimatedIncome1673922204915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "estimated_incomes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "type" character varying NOT NULL, "year" integer NOT NULL, "day" integer NOT NULL, "month_start" integer NOT NULL DEFAULT '1', "month_end" integer NOT NULL DEFAULT '12', "estimated" integer NOT NULL, CONSTRAINT "UQ_6fdb1fee6108d3fd50df46f0e02" UNIQUE ("description"), CONSTRAINT "PK_673a8b3fb75779b45f4d7a4e12f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "estimated_incomes"`);
  }
}

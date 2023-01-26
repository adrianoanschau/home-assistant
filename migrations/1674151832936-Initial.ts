import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1674151832936 implements MigrationInterface {
  name = 'Initial1674151832936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."Entry_type_enum" AS ENUM('income', 'investment', 'fixed-expense', 'variable-expense', 'credit-card-expense', 'installment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "type" "public"."Entry_type_enum" NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "value" double precision NOT NULL, "realized" boolean NOT NULL DEFAULT false, "transaction" uuid, "estimatedEntryId" uuid, CONSTRAINT "PK_bfb78427934a0d32faf987a1af0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "EstimatedEntry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "type" "public"."Entry_type_enum" NOT NULL, "year" integer NOT NULL, "day" integer NOT NULL, "month_start" integer NOT NULL DEFAULT '1', "month_end" integer NOT NULL DEFAULT '12', "estimated" double precision NOT NULL, CONSTRAINT "UQ_02549d3a6a1f8f91ac3671b9d75" UNIQUE ("description"), CONSTRAINT "PK_b1427e26b9245f17041f74da895" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Entry" ADD CONSTRAINT "FK_defa17adf96cd3b9a598f193856" FOREIGN KEY ("estimatedEntryId") REFERENCES "EstimatedEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Entry" DROP CONSTRAINT "FK_defa17adf96cd3b9a598f193856"`,
    );
    await queryRunner.query(`DROP TABLE "EstimatedEntry"`);
    await queryRunner.query(`DROP TABLE "Entry"`);
    await queryRunner.query(`DROP TYPE "public"."Entry_type_enum"`);
  }
}

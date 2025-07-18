import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747561648616 implements MigrationInterface {
  name = 'Migration1747561648616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "_user_"`);
    await queryRunner.query(
      `CREATE TABLE "_user_"."user" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "username" varchar(255), "email" varchar(255), "email_normalized" varchar(255), CONSTRAINT "IX__user__email_normalized" UNIQUE ("email_normalized"), CONSTRAINT "PK__user" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "_user_"."user"`);
  }
}

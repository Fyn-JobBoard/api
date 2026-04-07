import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentColumnOnApplications1775573286154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "attachment" character varying(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP COLUMN "attachment"`,
    );
  }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAttachmentColumnOnApplications1775573286154 implements MigrationInterface {
  private readonly COLUMN = new TableColumn({
    name: 'attachment',
    type: 'varchar',
    length: '255',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('applications', this.COLUMN);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('applications', this.COLUMN);
  }
}

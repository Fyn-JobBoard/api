import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class LinkAccountsToAccountsTable1768125956335 implements MigrationInterface {
  private TABLES = ['students', 'admins', 'companies', 'managed'];
  private FK = new TableForeignKey({
    columnNames: ['id'],
    referencedTableName: 'accounts',
    referencedColumnNames: ['id'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.TABLES.map((table) => queryRunner.createForeignKey(table, this.FK)),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.TABLES.map((table) => queryRunner.dropForeignKey(table, this.FK)),
    );
  }
}

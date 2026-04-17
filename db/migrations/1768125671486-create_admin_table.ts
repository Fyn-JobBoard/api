import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdminTable1768125671486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '60',
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '60',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admins');
  }
}

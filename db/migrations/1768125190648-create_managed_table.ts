import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateManagedTable1768125190648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'managed',
        columns: [
          { name: 'id', isPrimary: true, type: 'uuid' },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'author_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'permissions',
            type: 'bigint',
            unsigned: true,
            default: '0',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['author_id'],
            referencedTableName: 'accounts',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('managed');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateActiveSearches1769030594954 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'active_searches',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'student_id',
            type: 'uuid',
          },
          {
            name: 'criterias',
            type: 'json',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['student_id'],
            referencedTableName: 'students',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('active_searches');
  }
}

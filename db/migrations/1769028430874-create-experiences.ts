import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateExperiences1769028430874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'experiences',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '2048',
          },
          {
            name: 'begin_date',
            type: 'date',
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'student_id',
            type: 'uuid',
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: true,
          },

          {
            name: 'company_fallback_name',
            type: 'varchar',
            length: '70',
            isNullable: true,
            default: "''",
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
          {
            columnNames: ['company_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'set null',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('experiences');
  }
}

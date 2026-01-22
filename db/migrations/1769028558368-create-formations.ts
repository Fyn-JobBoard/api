import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFormations1769028558368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'formations',
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
            name: 'info_url',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '1024',
            isNullable: true,
          },
          {
            name: 'obtention_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
            comment: 'Stored as timestamp seconds',
          },

          {
            name: 'student_id',
            type: 'uuid',
          },
          {
            name: 'activity_domain_id',
            type: 'int',
            isNullable: true,
            comment: 'Null if no activity domain fit the formation',
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
            columnNames: ['activity_domain_id'],
            referencedTableName: 'activity_domains',
            referencedColumnNames: ['id'],
            onDelete: 'set null',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('formations');
  }
}

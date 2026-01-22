import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateJobsTagsTable1769087820756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'job_tags',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tag_id',
            type: 'int',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['tag_id'],
            referencedTableName: 'tags',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          {
            columnNames: ['job_id'],
            referencedTableName: 'jobs',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
        comment: 'Joining table for listing job-s tags',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('job_tags');
  }
}

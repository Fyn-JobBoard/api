import { ApplicationStatus } from 'src/common/enums/applicationStatus';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateApplications1769028776228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'message',
            type: 'varchar',
            length: '8192',
          },
          {
            name: 'status',
            type: 'application_status',
            default: `'${ApplicationStatus[ApplicationStatus.Draft]}'`,
          },

          {
            name: 'student_id',
            type: 'uuid',
          },
          {
            name: 'job_id',
            type: 'uuid',
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
            columnNames: ['job_id'],
            referencedTableName: 'jobs',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('applications');
  }
}

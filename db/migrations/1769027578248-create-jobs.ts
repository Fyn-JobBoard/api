import { RemunerationPeriods } from 'src/common/enums/remunerationPeriods';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateJobs1769027578248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '4096',
          },
          {
            name: 'apply_link',
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'languages',
            type: 'language',
            isArray: true,
          },
          {
            name: 'lat',
            type: 'decimal',
            scale: 4,
            precision: 6,
            isNullable: true,
          },
          {
            name: 'lng',
            type: 'decimal',
            precision: 7,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'mode',
            type: 'work_mode',
            isNullable: false,
          },
          {
            name: 'scrapped_from',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'remuneration',
            type: 'decimal',
            precision: 8,
            scale: 2,
            default: 0,
          },
          {
            name: 'remuneration_period',
            type: 'remuneration_period',
            default: `'${RemunerationPeriods.Single}'`,
          },
          {
            name: 'contract',
            type: 'work_contract',
          },
          {
            name: 'period_start',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'period_duration',
            type: 'int',
            unsigned: true,
            comment: 'Stored as timestamp seconds',
          },
          {
            name: 'min_formation_duration',
            type: 'int',
            unsigned: true,
            isNullable: true,
            comment: 'Stored as timestamp seconds',
          },
          {
            name: 'active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'moderation_feedback',
            type: 'varchar',
            length: '1024',
            isNullable: true,
          },

          {
            name: 'activity_domain_id',
            type: 'int',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['activity_domain_id'],
            referencedTableName: 'activity_domains',
            referencedColumnNames: ['id'],
            onDelete: 'restrict',
            onUpdate: 'cascade',
          },
          {
            columnNames: ['company_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}

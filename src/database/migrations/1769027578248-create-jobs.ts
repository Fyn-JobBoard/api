import { MigrationInterface, QueryRunner } from "typeorm";
import { Table } from "typeorm/schema-builder/table/Table";

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
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'apply_link',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'languages',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'lat',
            type: 'decimal',
            precision: 8,
            scale: 5,
            isNullable: true,
          },
          {
            name: 'lng',
            type: 'decimal',
            precision: 8,
            scale: 5,
            isNullable: true,
          },
          {
            name: 'mode',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'scrapped_from',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'remuneration',
            type: 'decimal',
            precision: 8,
            scale: 2,
            isNullable: false,
            default: 0,
          },
          {
            name: 'remuneration_period',
            type: 'varchar',
            length: '20',
            isNullable: false,
            default: "'Single'",
          },
          {
            name: 'contract',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'period_start',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'period_duration',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'min_formation_duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'moderation_feedback',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompanyTable1768125786301 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '250',
          },
          {
            name: 'bio',
            type: 'text',
            default: "''",
          },
          {
            name: 'creation_date',
            type: 'date',
          },
          {
            name: 'scrapped_from',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'website_url',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies');
  }
}

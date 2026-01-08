import { AccountTypes } from 'db/enums/accountTypes';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccountTable1767886845486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE account_type AS ENUM (${Object.values(AccountTypes)
        .map((t) => `'${t}'`)
        .join(',')})`,
    );
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '200',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '200',
            comment: 'Hashed password',
          },
          {
            name: 'type',
            type: 'account_type',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts', true);
    await queryRunner.query('DROP TYPE account_type');
  }
}

import { AccountStatus } from 'src/common/enums/accountStatus';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccountTable1767886845486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
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
          {
            name: 'status',
            type: 'account_status',
            default: `'${AccountStatus.Created}'`,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts', true);
  }
}

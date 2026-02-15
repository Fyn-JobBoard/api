import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddJwtVersionColumnOnAccounts1771175124306 implements MigrationInterface {
  private COLUMN = new TableColumn({
    name: 'jwt_version',
    isNullable: true,
    type: 'integer',
    unsigned: true,
    comment:
      "The account's JWT version. If null, no jwt should be valid for this account.",
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('accounts', this.COLUMN);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', this.COLUMN);
  }
}

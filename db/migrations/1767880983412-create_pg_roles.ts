import assert from 'node:assert';
import { PGRoles, PGRolesPassword } from 'src/common/enums/roles';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePgRoles1767880983412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = Object.values(PGRoles)
      .map((role) => {
        const password = PGRolesPassword(role);
        assert(
          password,
          `Role ${role} does not have a password. Please define one.`,
        );
        return `CREATE ROLE ${role} LOGIN PASSWORD '${password}'`;
      })
      .join(';');

    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      Object.values(PGRoles)
        .map((role) => `DROP ROLE ${role}`)
        .join(';'),
    );
  }
}

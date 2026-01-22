import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddActivityDomainToCompaniesTable1769088423004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'activity_domain_id',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'companies',
      new TableForeignKey({
        columnNames: ['activity_domain_id'],
        referencedTableName: 'activity_domains',
        referencedColumnNames: ['id'],
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('companies', 'activity_domain_id');
    await queryRunner.dropColumn('companies', 'activity_domain_id');
  }
}

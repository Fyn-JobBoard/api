import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddActivityMainToStudentsTable1769088922318 implements MigrationInterface {
  private readonly FOREIGN_KEY = new TableForeignKey({
    columnNames: ['activity_domain_id'],
    referencedTableName: 'activity_domains',
    referencedColumnNames: ['id'],
    onDelete: 'restrict',
    onUpdate: 'cascade',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'students',
      new TableColumn({
        name: 'activity_domain_id',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey('students', this.FOREIGN_KEY);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('students', this.FOREIGN_KEY);
    await queryRunner.dropColumn('students', 'activity_domain_id');
  }
}

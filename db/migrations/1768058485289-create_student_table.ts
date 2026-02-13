import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStudentTable1768058485289 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          {
            name: 'first_name',
            type: 'varchar',
            length: '60',
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '60',
          },
          {
            name: 'birthdate',
            type: 'date',
          },
          {
            name: 'bio',
            type: 'varchar',
            length: '1024',
            default: "''",
          },
          {
            name: 'links',
            type: 'varchar',
            length: '200',
            isArray: true,
            default: '[]',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('students');
  }
}

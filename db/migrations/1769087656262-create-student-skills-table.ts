import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStudentSkillsTable1769087656262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'student_skills',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'skill_id',
            type: 'int',
          },
          {
            name: 'student_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['skill_id'],
            referencedTableName: 'skills',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          {
            columnNames: ['student_id'],
            referencedTableName: 'students',
            referencedColumnNames: ['id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
        comment: 'Joining table for listing student-s skills',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('student_skills');
  }
}

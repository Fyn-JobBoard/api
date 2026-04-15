import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class SetSkillsUnicity1770891992958 implements MigrationInterface {
  private readonly CONSTRAINT_NAME = 'skill-unicity';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'skills',
      new TableUnique({
        columnNames: ['name', 'type'],
        name: this.CONSTRAINT_NAME,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('skills', this.CONSTRAINT_NAME);
  }
}

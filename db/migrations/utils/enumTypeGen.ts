import { MigrationInterface, QueryRunner } from 'typeorm';

export class PGEnumToType implements MigrationInterface {
  /**
   * @param enums Object where keys are the created pg types and values the enums to associate
   */
  constructor(private readonly enums: { [key: string]: object }) {}

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [type, enum_object] of Object.entries(this.enums)) {
      await queryRunner.query(
        `CREATE TYPE ${type} AS ENUM (${Object.values(enum_object)
          .filter((t) => typeof t === 'string')
          .map((t) => `'${t}'`)
          .join(',')})`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      Object.keys(this.enums).map((type) =>
        queryRunner.query(`DROP TYPE ${type}`),
      ),
    );
  }
}

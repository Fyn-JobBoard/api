import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Passing from a BIGINT column to an INT column.
 * This allows to use JS's integers instead of string (as pgsql's BIGINT can be way higher than JS's numbers)
 */
export class ChangeManagedPermissionsColumnType1780131085644 implements MigrationInterface {
  protected static tableName = 'managed';
  protected static columnName = 'permissions';
  protected static temporaryColumnName = 'permissions_old';

  protected static fromType = 'bigint';
  protected static toType = 'int';

  protected tableColumn(type: string) {
    return new TableColumn({
      name: ChangeManagedPermissionsColumnType1780131085644.columnName,
      type,
      unsigned: true,
      default: '0',
    });
  }
  /**
   * Transfer the temporary column's value to the final column.
   */
  public async transferValues(queryRunner: QueryRunner): Promise<void> {
    /**
     * Note: to avoid value overflow, we set the maximum value to "4294967295".
     */
    await queryRunner.query(`
        UPDATE ${ChangeManagedPermissionsColumnType1780131085644.tableName}
        SET ${ChangeManagedPermissionsColumnType1780131085644.columnName}=LEAST(4294967295,${ChangeManagedPermissionsColumnType1780131085644.temporaryColumnName})
    `);
  }

  protected async changeColumnType(
    queryRunner: QueryRunner,
    targetType: string,
  ) {
    await queryRunner.renameColumn(
      ChangeManagedPermissionsColumnType1780131085644.tableName,
      ChangeManagedPermissionsColumnType1780131085644.columnName,
      ChangeManagedPermissionsColumnType1780131085644.temporaryColumnName,
    );

    await queryRunner.addColumn(
      ChangeManagedPermissionsColumnType1780131085644.tableName,
      this.tableColumn(targetType),
    );

    await this.transferValues(queryRunner);

    await queryRunner.dropColumn(
      ChangeManagedPermissionsColumnType1780131085644.tableName,
      ChangeManagedPermissionsColumnType1780131085644.temporaryColumnName,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.changeColumnType(
      queryRunner,
      ChangeManagedPermissionsColumnType1780131085644.toType,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.changeColumnType(
      queryRunner,
      ChangeManagedPermissionsColumnType1780131085644.fromType,
    );
  }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateRefreshTokensGracePeriod1710100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add firstUsedAt column
    await queryRunner.addColumn(
      'refresh_tokens',
      new TableColumn({
        name: 'firstUsedAt',
        type: 'timestamp',
        isNullable: true, // Initially nullable for existing records
      }),
    );

    // Add usageCount column
    await queryRunner.addColumn(
      'refresh_tokens',
      new TableColumn({
        name: 'usageCount',
        type: 'int',
        default: 0,
        isNullable: false,
      }),
    );

    // Update existing records to set firstUsedAt to createdAt for consistency
    await queryRunner.query(
      `UPDATE refresh_tokens SET "firstUsedAt" = "createdAt" WHERE "firstUsedAt" IS NULL`,
    );

    // Make firstUsedAt non-nullable after updating existing records
    await queryRunner.changeColumn(
      'refresh_tokens',
      'firstUsedAt',
      new TableColumn({
        name: 'firstUsedAt',
        type: 'timestamp',
        isNullable: false,
      }),
    );

    // Remove replacedByToken column
    await queryRunner.dropColumn('refresh_tokens', 'replacedByToken');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back replacedByToken column
    await queryRunner.addColumn(
      'refresh_tokens',
      new TableColumn({
        name: 'replacedByToken',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Remove usageCount column
    await queryRunner.dropColumn('refresh_tokens', 'usageCount');

    // Remove firstUsedAt column
    await queryRunner.dropColumn('refresh_tokens', 'firstUsedAt');
  }
}

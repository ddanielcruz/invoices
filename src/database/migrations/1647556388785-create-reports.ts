import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createReports1647556388785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'key',
            type: 'varchar',
            isNullable: true,
            isUnique: true
          },
          {
            name: 'type',
            type: 'varchar'
          },
          {
            name: 'data',
            type: 'json'
          },
          {
            name: 'status',
            type: 'varchar'
          },
          {
            name: 'error',
            type: 'json',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reports')
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createInvoices1646171702715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'url',
            type: 'varchar',
            isUnique: true
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
            name: 'issued_at',
            type: 'timestamp',
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
    await queryRunner.dropTable('invoices')
  }
}

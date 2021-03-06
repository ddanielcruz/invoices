import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createPurchases1646264955898 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'purchases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'invoice_id',
            type: 'uuid'
          },
          {
            name: 'product_id',
            type: 'uuid'
          },
          {
            name: 'price',
            type: 'numeric(15,6)'
          },
          {
            name: 'quantity',
            type: 'numeric(15,6)'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['invoice_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'invoices',
            onDelete: 'CASCADE'
          },
          {
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
            onDelete: 'CASCADE'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchases')
  }
}

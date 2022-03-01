import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createAddresses1646171371902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'city_id',
            type: 'uuid'
          },
          {
            name: 'street',
            type: 'varchar'
          },
          {
            name: 'neighborhood',
            type: 'varchar'
          },
          {
            name: 'zipcode',
            type: 'varchar'
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true
          }
        ],
        foreignKeys: [
          {
            columnNames: ['city_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cities',
            onDelete: 'RESTRICT'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses')
  }
}

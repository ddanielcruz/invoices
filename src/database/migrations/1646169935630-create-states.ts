import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createStates1646169935630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'states',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'country_id',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true
          }
        ],
        foreignKeys: [
          {
            columnNames: ['country_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'countries',
            onDelete: 'CASCADE'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('states')
  }
}

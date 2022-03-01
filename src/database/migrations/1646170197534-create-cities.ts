import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createCities1646170197534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'state_id',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'varchar'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['state_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'states',
            onDelete: 'CASCADE'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cities')
  }
}

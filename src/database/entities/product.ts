import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Company } from './company'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  companyId: string

  @Column()
  referenceCode: string

  @Column()
  name: string

  @Column()
  unitOfMeasure: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Company, company => company.products)
  company?: Company
}

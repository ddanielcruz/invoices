import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Company } from './company'
import { Invoice } from './invoice'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  invoiceId: string

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

  @ManyToOne(() => Invoice)
  invoice?: Invoice

  @ManyToOne(() => Company)
  company?: Company
}

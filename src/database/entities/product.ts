import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Company } from './company'
import { Purchase } from './purchase'

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
  company: Company | null

  @OneToMany(() => Purchase, purchase => purchase.product)
  purchases: Purchase[] | null
}

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

export type InvoiceStatus = 'PENDING' | 'SUCCESS' | 'FAILURE'

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  companyId: string | null

  @Column()
  url: string

  @Column({ type: 'varchar' })
  status: InvoiceStatus = 'PENDING'

  @Column({ type: 'json' })
  error: any

  @Column({ type: 'timestamp' })
  issuedAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Company, company => company.invoices)
  company: Company

  @OneToMany(() => Purchase, purchase => purchase.invoice)
  purchases: Purchase[] | null

  constructor(url: string) {
    this.url = url
  }
}

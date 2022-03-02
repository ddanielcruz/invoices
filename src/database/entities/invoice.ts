import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Company } from './company'
import { Product } from './product'

export type InvoiceStatus = 'PENDING' | 'SUCCESS' | 'FAILURE'

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  url: string

  @Column({ type: 'varchar' })
  status: InvoiceStatus = 'PENDING'

  @Column({ type: 'json' })
  error?: any

  @CreateDateColumn()
  createdAt: Date

  @OneToOne(() => Company)
  company?: Company

  products?: Product[]

  constructor(url: string) {
    this.url = url
  }
}

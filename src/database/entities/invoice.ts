import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { ProductPurchase } from './product-purchase'

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
  error: any

  @Column({ type: 'timestamp' })
  issuedAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => ProductPurchase, purchase => purchase.invoice)
  purchases: ProductPurchase[] | null

  constructor(url: string) {
    this.url = url
  }
}

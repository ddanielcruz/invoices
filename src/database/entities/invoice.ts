import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column()
  issuedAt?: Date

  @CreateDateColumn()
  createdAt: Date

  constructor(url: string) {
    this.url = url
  }
}

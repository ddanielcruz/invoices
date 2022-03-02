import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Invoice } from './invoice'
import { Product } from './product'

@Entity({ name: 'product_purchases' })
export class ProductPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  invoiceId: string

  @Column()
  productId: string

  @Column()
  price: number

  @Column()
  quantity: number

  @ManyToOne(() => Product, product => product.purchases)
  product?: Product

  @ManyToOne(() => Invoice, invoice => invoice.purchases)
  invoice?: Invoice
}

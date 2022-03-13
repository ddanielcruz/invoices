import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { NumericColumnTransformer } from '../transformers'
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

  @Column({ transformer: new NumericColumnTransformer() })
  price: number

  @Column()
  quantity: number

  @ManyToOne(() => Product, product => product.purchases)
  product: Product | null

  @ManyToOne(() => Invoice, invoice => invoice.purchases)
  invoice: Invoice | null
}

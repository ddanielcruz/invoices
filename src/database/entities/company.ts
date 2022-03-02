import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Address } from './address'
import { Product } from './product'

@Entity({ name: 'entities' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  addressId: string

  @Column()
  companyName: string

  @Column()
  tradeName: string

  @Column()
  document: string

  @CreateDateColumn()
  createdAt: Date

  @OneToOne(() => Address, addr => addr.company)
  @JoinColumn()
  address?: Address

  @OneToMany(() => Product, product => product.company)
  products?: Product[]
}

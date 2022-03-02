import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Address, Invoice } from '.'

@Entity({ name: 'entities' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  invoiceId: string

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

  @OneToOne(() => Invoice)
  @JoinColumn()
  invoice?: Invoice

  @OneToOne(() => Address)
  @JoinColumn()
  address?: Address
}

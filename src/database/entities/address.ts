import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { City } from './city'
import { Company } from './company'

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  cityId: string

  @Column()
  street: string

  @Column()
  neighborhood: string

  @Column()
  zipcode: string

  @Column()
  complement?: string

  @ManyToOne(() => City, city => city.addresses)
  city?: City

  @OneToOne(() => Company)
  company?: Company
}

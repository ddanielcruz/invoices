import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Address } from '.'
import { State } from './state'

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  stateId: string

  @Column()
  name: string

  @Column()
  normalizedName: string

  @ManyToOne(() => State, state => state.cities)
  state: State | null

  @OneToMany(() => Address, address => address.city)
  addresses: Address[] | null
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { State } from './state'

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  code: string

  @OneToMany(() => State, state => state.country)
  states?: State[]
}

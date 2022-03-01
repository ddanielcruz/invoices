import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Country } from './country'

@Entity({ name: 'states' })
export class State {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  countryId: string

  @Column()
  name: string

  @Column()
  code: string

  @ManyToOne(() => Country, country => country.states)
  country: Country
}

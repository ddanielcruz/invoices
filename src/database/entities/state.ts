import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { City } from './city'
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
  country: Country | null

  @OneToMany(() => City, city => city.state)
  cities: City[] | null
}

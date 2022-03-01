import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { State } from './state'

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  stateId: string

  @Column()
  name: string

  @ManyToOne(() => State, state => state.cities)
  state: State
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('messagelikes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userName: string

  @Column()
  messageId: number
}

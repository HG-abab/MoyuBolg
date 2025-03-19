import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userName: string

  @Column()
  articleId: number
}

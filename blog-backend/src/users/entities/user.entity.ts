import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({ select: false })
  password: string

  // 第三方的id 可以为空
  @Column({ nullable: true })
  providerId: string

  @Column({ nullable: true })
  provider: string

  @Column({ nullable: true })
  avatar: string
}

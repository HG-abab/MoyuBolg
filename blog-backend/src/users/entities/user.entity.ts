import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  password: string

  // 第三方的id 可以为空
  @Column({ nullable: true })
  providerId: string

  @Column({ nullable: true })
  provider: string

  @Column({ nullable: true })
  avatar: string

  // 新增字段：存储重置令牌
  @Column({ nullable: true })
  resetToken: string;

  // 新增字段：存储令牌过期时间
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;
}

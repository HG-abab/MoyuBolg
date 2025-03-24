import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({ length: 255 })
  copy: string; // 站长文案
  
  @Column({ length: 255 })
  webmasterProfileBackground: string; // 头像背景图

  @Column({ length: 255 })
  githubLink: string; // Github地址

  @Column({ length: 255 })
  giteeLink: string; // Gitee地址

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

  //是否具有管理员权限 0：没有 1：有
  @Column()
  isChecked: boolean
}

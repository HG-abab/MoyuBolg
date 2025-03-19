import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column('text')
  avatar: string

  // 添加评论数、点赞数、收藏数
  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column('text')
  content: string;

  @Column({ default: false })
  isCheck: boolean;

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;
}

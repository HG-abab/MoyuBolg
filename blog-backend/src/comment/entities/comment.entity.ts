import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column()
  typeId: number;

  @Column('text')
  Avatar: string;

  // 评论的标题
  @Column({ type: 'text', charset: 'utf8mb4' })
  commentTitle: string;

  // 评论数量
  @Column({ default: 0 })
  commentCount: number;

  // 点赞数量
  @Column({ default: 0 })
  likeCount: number;

  // 使用 'text' 类型，明确 charset 配置
  @Column({ type: 'text', charset: 'utf8mb4' })
  commentContent: string;

  @Column()
  commentUserName: string;

  @Column({ default: true })
  isCheck: boolean;

  @Column()
  createTime: Date;

  @Column({ nullable: true })
  parentId: number;
}

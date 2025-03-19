import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleCover: string;

  @Column()
  articleTitle: string;

  @Column('text') // 文章内容字段
  articleContent: string;

  @Column()
  articleType: number;

  @Column()
  categoryName: string;

  @Column('simple-array') // 存储 ['Vue', 'JavaScript']
  tagsName: string[];

  @Column({ type: 'tinyint', default: 1 }) // 1: 发布, 0: 草稿
  status: number;

  @Column({ default: 0 })
  isTop: number;

  @Column({ default: 0 })
  visitCount: number;

  // 添加评论数、点赞数、收藏数
  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column()
  userName: string;

  @CreateDateColumn()
  createTime: Date;
  collectCount: any;
}

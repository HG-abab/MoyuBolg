// 背景图url数据库
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bgurl')
export class BgUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  size: number;

  @Column()
  type: string;

  @Column()
  userId: string;

  @Column()
  sortOrder: number;

  // 自动生成创建时间
  @CreateDateColumn({ type: 'timestamp' })
  createTime: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('collect')
export class Collect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ nullable: true })
  targetId: number;  // 文章或留言的 ID，收藏的目标 ID

  @Column()
  type: number; //1:文章 2:留言

  @Column('text')
  content: string;

  @Column({ default: false })
  isCheck: boolean

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;

}

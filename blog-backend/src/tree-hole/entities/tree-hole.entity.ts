import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('treehole')
export class TreeHole {
  // 树洞id
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column('text')
  avatar: string;

  // 树洞内容
  @Column('text')
  content: string;

  @Column({ default: false })
  isCheck: boolean;

  // 树洞创建时间
  @Column()
  createTime: Date;

  // 树洞更新时间
  @Column()
  updateTime: Date;
}

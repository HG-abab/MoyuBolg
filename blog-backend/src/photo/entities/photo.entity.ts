import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('photoalbum')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 默认为空字符串
  @Column({ default: '' })
  description: string;

  @Column({ type: 'int', nullable: true, default: null })
  parentId: number | null;

  @Column()
  type: number;

  @Column({ default: '' })
  url: string;

  @Column({ default: '' })
  size: string;

  @CreateDateColumn()
  createTime: Date;
}

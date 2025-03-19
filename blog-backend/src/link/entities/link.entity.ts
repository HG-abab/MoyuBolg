import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  background: string;

  @Column()
  email: string;

  @Column()
  url: string;

  @Column({ default: false })
  isCheck: boolean;

  @Column()
  createTime: Date;
}

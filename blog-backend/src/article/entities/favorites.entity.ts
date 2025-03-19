import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  articleId: number;
}

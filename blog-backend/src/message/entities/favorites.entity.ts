import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('messagefavorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  messageId: number;
}

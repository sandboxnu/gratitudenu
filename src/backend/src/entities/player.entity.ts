import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Game, (game) => game.players)
  game: Game;

  @Column()
  color: string;
}

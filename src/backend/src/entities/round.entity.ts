import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  BaseEntity,
} from 'typeorm';
import { Game } from './game.entity';
import { Grab } from './grab.entity';

@Entity()
export class Round extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roundNumber: number;

  @Column()
  pointsRemaining: number;

  @OneToMany((type) => Grab, (grab) => grab.round)
  playerMoves: Grab[];

  @ManyToOne((type) => Game, (game) => game.rounds)
  game: Game;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Player } from './player.entity';
import { Round } from './round.entity';

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Round, (round) => round.game)
  rounds: Round[];

  @Column()
  ongoing: boolean;

  @OneToMany((type) => Player, (player) => player.game)
  players: Player[];

  @Column({ nullable: true }) // has to be nullable for backwards compatibility but i guess if you're willing to tear down your database then you can?
  maxRounds: number; // Including max rounds on game, so that it doesn't become weird and inconsistent between games if changed in the middle
}

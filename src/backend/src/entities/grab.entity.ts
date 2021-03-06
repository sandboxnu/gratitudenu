import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Round } from './round.entity';
import { Player } from './player.entity';

@Entity()
export class Grab extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Player)
  @JoinColumn()
  player: Player;

  /**
   * How Many Points were taken in this grab
   */
  @Column()
  howMany: number;

  /**
   * How long did it take the user to take this many points
   */
  @Column()
  timeTaken: number;

  @ManyToOne((type) => Round, (round) => round.playerMoves)
  round: Round;
}

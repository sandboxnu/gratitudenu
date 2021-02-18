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
import { User } from './user.entity';

@Entity()
export class Grab extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

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

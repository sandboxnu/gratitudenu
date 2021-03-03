import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Game } from './game.entity';

// IDK, just placeholder values for now
export enum EmotionIdEnum {
  Calm,
  Greedy,
  NotGreedy,
}

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn() // Do we even need this anymore?
  id: number;

  @Column()
  userId: number;

  @Column()
  emotionId: EmotionIdEnum;

  @ManyToOne((type) => Game, (game) => game.players)
  game: Game;

  @Column()
  color: string;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Game } from './game.entity';
import { Grab } from './grab.entity';

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

  @OneToMany((type) => Grab, (grab) => grab.player)
  grabs: Grab[];

  @Column({
    nullable: true,
  })
  color!: string;
}

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

export enum EmotionIdEnum {
  Greedy = 1,
  NotGreedy = 2,
}

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
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

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Grab } from './grab.entity';
import { Player } from './player.entity';
import { Round } from './round.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Round, (round) => round.game)
  rounds: Round[];

  @Column()
  ongoing: boolean;

  @OneToMany((type) => Player, (player) => player.game)
  players: Player[];
}
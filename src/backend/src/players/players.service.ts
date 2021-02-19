import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  async findOne(id: number): Promise<Player> {
    const player = this.playersRepository.findOne(id);
    if (!player) {
      throw new BadRequestException('Player not found');
    }
    return player;
  }

  // Not sure if I should be taking these in or userId, gameId?
  async create(user: User, game: Game, color: string): Promise<Player> {
    let player = new Player();
    player.user = user;
    player.game = game; // Do I even want to set this?
    player.color = color;

    await this.playersRepository.save(player);

    return player;
  }
}

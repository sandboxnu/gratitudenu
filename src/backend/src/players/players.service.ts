import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  async findOne(id: number): Promise<Player> {
    const player = this.playersRepository.findOne(id);
    if (!player) {
      throw new BadRequestException('Player not found');
    }
    return player;
  }

  // Changed the create to update since we already have @Post create()
  async update(
    playerId: number,
    gameId: number,
    color: string,
  ): Promise<Number> {
    let player = await this.findOne(playerId);
    player.color = color;

    const game = await this.gamesRepository.findOne(gameId);
    if (!game) {
      throw new BadRequestException('Game not found');
    }
    player.game = game;

    await this.playersRepository.save(player);
    return player.id;
  }
}

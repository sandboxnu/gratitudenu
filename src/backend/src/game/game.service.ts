import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(playerIds: number[]): Promise<number> {
    const players = await Promise.all(
      playerIds.map(async (id) => {
        return await this.playersRepository.findOne(id);
      }),
    );

    const game = await Game.create({ rounds: [], ongoing: true, players });

    await game.save();

    return game.id;
  }
}

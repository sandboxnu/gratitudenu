import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { GameSseService } from './game.sse.service';
import { Round } from '../entities/round.entity';

const MAX_POINTS = 200;
type GameRoundID = {
  gameId: number;
  roundId: number;
};

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async create(playerIds: number[]): Promise<GameRoundID> {
    const players = await Promise.all(
      playerIds.map(async (id) => {
        return await this.playersRepository.findOne(id);
      }),
    );

    const game = await Game.create({ rounds: [], ongoing: true, players });

    await game.save();

    const newRound = Round.create({
      roundNumber: 1,
      pointsRemaining: MAX_POINTS,
      playerMoves: [],
      game,
    });

    await newRound.save();

    return { gameId: game.id, roundId: newRound.id };
  }

  async getPoints(playerId: number): Promise<number> {
    const player = await this.playersRepository.findOne(playerId);
    const lastRound = player.game.rounds.pop();
    const pGrab = lastRound.playerMoves.find((g) => g.player.id === playerId);

    return pGrab.howMany;
  }

  async findOne(id: number): Promise<Game> {
    const game = this.gamesRepository.findOne(id);
    if (!game) {
      return;
    }
    return game;
  }
}

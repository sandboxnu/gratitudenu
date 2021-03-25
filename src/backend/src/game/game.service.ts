import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Round } from '../entities/round.entity';
import { Grab } from 'src/entities/grab.entity';

const MAX_POINTS = 200;
const MAX_ROUND_COUNT = 10;

type GameRoundID = {
  gameId: number;
};

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
  ) {}

  // create the initial round
  async create(playerIds: number[]): Promise<GameRoundID> {
    const players = await Promise.all(
      playerIds.map(async (id) => {
        return await this.playersRepository.findOne(id);
      }),
    );

    const game = await Game.create({
      ongoing: true,
      players,
    }).save();

    const newRound = await Round.create({
      roundNumber: 1,
      pointsRemaining: MAX_POINTS,
      game,
    }).save();

    return { gameId: game.id };
  }

  // get points remaining
  async getSumPoints(roundId: number): Promise<number> {
    const round = await this.roundRepository.findOne(roundId, {
      relations: ['playerMoves'],
    });
    const prevSumPoints = round.pointsRemaining;
    const sumPoints = (acc, cur: Grab) => acc + cur.howMany;
    const totalGrabs = round.playerMoves.reduce(sumPoints, 0);

    const currSumPoints = Math.round(prevSumPoints - totalGrabs * 0.9); // give back 10%
    return currSumPoints;
  }

  async findOne(id: number): Promise<Game> {
    const game = this.gamesRepository.findOne(id, {
      relations: ['rounds'],
    });
    if (!game) {
      return;
    }
    return game;
  }

  async updateOngoing(gameId: number, roundId: number): Promise<boolean> {
    const game: Game = await this.findOne(gameId);
    // no points remaining, or max round
    const pointsRemaining = await this.getSumPoints(roundId);
    const roundCount = game.rounds.length;
    if (pointsRemaining <= 0 || roundCount >= MAX_ROUND_COUNT) {
      game.ongoing = false;
      await game.save();
    }
    return game.ongoing;
  }
}

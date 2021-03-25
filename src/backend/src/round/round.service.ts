import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from '../entities/round.entity';
import { Repository } from 'typeorm';
import { Game } from 'src/entities/game.entity';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async findOne(id: number): Promise<Round> {
    const round = this.roundRepository.findOne(id);
    if (!round) {
      return;
    }
    return round;
  }

  // creates a new round
  async create(
    pointsRemaining: number,
    prevRoundNum: number,
    game: Game,
  ): Promise<Round> {
    const newRound = Round.create({
      roundNumber: prevRoundNum + 1,
      pointsRemaining: pointsRemaining,
      game,
    });
    await newRound.save();
    return newRound;
  }

  async findByRoundNumber(roundNumber: number, gameId: number): Promise<Round> {
    const game = await this.gameRepository.findOne(gameId, {
      relations: ['rounds'],
    });

    const roundId = game.rounds.find((r) => r.roundNumber === roundNumber).id;

    const round = await this.roundRepository.findOne(roundId, {
      relations: ['playerMoves', 'game'],
    });
    return round;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from '../entities/round.entity';
import { Repository } from 'typeorm';
import { Game } from 'src/entities/game.entity';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
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
    roundNumber: number,
    game: Game,
  ): Promise<Round> {
    const newRound = Round.create({
      roundNumber: roundNumber + 1,
      pointsRemaining: pointsRemaining,
      playerMoves: [],
      game,
    });
    await newRound.save();
    return newRound;
  }
}

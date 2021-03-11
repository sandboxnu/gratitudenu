import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { Grab } from '../entities/grab.entity';
import { Round } from '../entities/round.entity';
import { GameSseService } from './game.sse.service';
import { Response } from 'express';

@Controller('game')
export class GameController {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Round)
    private roundsRepository: Repository<Round>,
    private gameSseService: GameSseService,
  ) {}

  // TODO: /sse endpoint to subscribe each player => waitingRoom

  @Post('take')
  async take(
    @Body('playerId') playerId: number,
    @Body('howMany') howMany: number,
    @Body('timeTaken') timeTaken: number,
    @Body('roundId') roundId: number,
    @Res() res: Response,
  ): Promise<number> {
    const player = await this.playersRepository.findOne(playerId);
    if (!player) {
      throw new BadRequestException('Player does not exist');
    }

    const round = await this.roundsRepository.findOne(roundId);
    if (!round) {
      throw new BadRequestException('Round does not exist');
    }

    const grab = await Grab.create({
      round,
      player,
      howMany,
      timeTaken,
    }).save();

    if (round.playerMoves.length === 4) {
      // Send round results to all players
      await this.gameSseService.updateGameWithRoundResults(
        player.game.id,
        roundId,
      );
    } // If 4 moves and (game is over => no points left || max rounds)

    return grab.id;
  }
}

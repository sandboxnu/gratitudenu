import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { GameService } from './game.service';
import { RoundService } from '../round/round.service';

const MAX_PLAYERS = 4;

@Controller('game')
export class GameController {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Round)
    private roundsRepository: Repository<Round>,
    private roundService: RoundService,
    private gameSseService: GameSseService,
    private gameService: GameService,
  ) {}

  @Get('sse')
  async subscribePlayer(
    @Body('playerId') playerId: number,
    @Body('gameId') gameId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    });

    await this.gameSseService.subscribeClient(res, {
      playerId,
      gameId,
    });
  }

  @Post('take')
  async take(
    @Body('playerId') playerId: number,
    @Body('howMany') howMany: number,
    @Body('timeTaken') timeTaken: number,
    @Body('roundId') roundId: number,
  ): Promise<number> {
    const player = await this.playersRepository.findOne(playerId);
    if (!player) {
      throw new BadRequestException('Player does not exist');
    }

    let round = await this.roundsRepository.findOne(roundId);
    if (!round) {
      throw new BadRequestException('Round does not exist');
    }

    const grab = await Grab.create({
      round,
      player,
      howMany,
      timeTaken,
    }).save();

    round = await this.roundsRepository.findOne(roundId, {
      relations: ['playerMoves', 'game'],
    }); // Check for updates

    if (round.playerMoves.length === MAX_PLAYERS) {
      // check if game is over
      const isOngoing = await this.gameService.updateOngoing(
        round.game.id,
        roundId,
      );
      if (isOngoing) {
        // Create new Round after calculating remaining points
        const game = await this.gameService.findOne(round.game.id);
        const adjustedTotal: number = await this.gameService.getSumPoints(
          roundId,
        );
        const newRound = await this.roundService.create(
          adjustedTotal,
          round.roundNumber,
          game,
        );

        // Send round results to all players
        this.gameSseService.updateGameWithRoundResults(game.id, newRound);
      } else {
        // stop game
        this.gameSseService.endGame(round.game.id);
      }
    }

    return grab.id;
  }
}

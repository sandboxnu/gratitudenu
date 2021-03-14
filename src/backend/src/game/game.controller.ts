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
import { PlayersService } from 'src/players/players.service';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Round)
    private roundsRepository: Repository<Round>,
    private gameSseService: GameSseService,
    private gameService: GameService,
    private playerService: PlayersService,
  ) {}

  @Post('sse')
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
    @Res() res: Response,
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

    if (round.playerMoves.length === 4) {
      // check if game is over
      const isOngoing = await this.gameService.updateOngoing(
        round.game.id,
        roundId,
      );
      if (isOngoing) {
        // Send round results to all players
        await this.gameSseService.updateGameWithRoundResults(
          round.game.id,
          roundId,
        );
      } else {
        // stop game
        this.gameSseService.endGame(round.game.id);
      }
    }

    return grab.id;
  }
}

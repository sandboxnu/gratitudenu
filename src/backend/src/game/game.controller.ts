import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
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
    @Query('playerId') playerId: number,
    @Query('gameId') gameId: number,
    @Res() res: Response,
  ): Promise<void> {
    const player = await this.playersRepository.findOne(playerId, {
      relations: ['game'],
    });
    if (player.game.id != gameId) {
      throw new BadRequestException(
        `Player ${playerId} does not belong to game ${gameId}`,
      );
    }

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
    @Body('roundNumber') roundNumber: number,
  ): Promise<number> {
    const player = await this.playersRepository.findOne(playerId, {
      relations: ['grabs', 'game'],
    });

    let round = await this.roundService.findByRoundNumber(
      roundNumber,
      player.game.id,
    );
    if (!round) {
      throw new BadRequestException('Round number does not exist');
    } // Check for updates
    this.validatePlayerAndRound(player, round);

    const grab = await Grab.create({
      round,
      player,
      howMany,
      timeTaken,
    }).save();

    // await round.reload();
    round = await Round.findOne(round.id, {
      relations: ['playerMoves', 'game'],
    });

    if (round.playerMoves.length === MAX_PLAYERS) {
      // check if game is over
      const isOngoing = await this.gameService.updateOngoing(
        round.game.id,
        round.id,
      );
      if (isOngoing) {
        // Create new Round after calculating remaining points
        const game = await this.gameService.findOne(round.game.id);
        const adjustedTotal: number = await this.gameService.getSumPoints(
          round.id,
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

  private validatePlayerAndRound(player: Player, round: Round) {
    if (!round) {
      throw new BadRequestException('Round does not exist');
    }

    if (!player) {
      throw new BadRequestException('Player does not exist');
    }

    if (
      round.playerMoves.find((grab) =>
        player.grabs.find((playerGrab) => playerGrab.id === grab.id),
      )
    ) {
      throw new BadRequestException(
        'This Player has already taken a turn this round',
      );
    }
  }
}

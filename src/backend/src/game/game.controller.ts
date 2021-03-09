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

    const grab = Grab.create({ round, player, howMany, timeTaken });

    await this.gameSseService.subscribeClient(res, {
      playerId: playerId,
      gameId: player.game.id,
      roundId,
    });

    await grab.save();

    return grab.id;
  }
}

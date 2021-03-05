import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Grab } from '../entities/grab.entity';
import { Round } from '../entities/round.entity';

@Controller('game')
export class GameController {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Round)
    private roundsRepository: Repository<Round>,
  ) {}

  @Post()
  async create(@Body('playerIds') playerIds: number[]): Promise<number> {
    const players = await Promise.all(
      playerIds.map(async (id) => {
        return await this.playersRepository.findOne(id);
      }),
    );

    const game = await Game.create();

    game.ongoing = true;
    game.players = players;
    game.rounds = [];

    game.save();

    return game.id;
  }

  @Post()
  async take(
    @Body('playerId') playerId: number,
    @Body('howMany') howMany: number,
    @Body('timeTaken') timeTaken: number,
    @Body('roundId') roundId: number,
    @Body('gameId') gameId: number,
  ): Promise<number> {
    const player = await this.playersRepository.findOne(playerId);
    if (!player) {
      throw new BadRequestException('Player does not exist');
    }

    const round = await this.roundsRepository.findOne(roundId);
    if (!round) {
      throw new BadRequestException('Round does not exist');
    }

    const grab = await Grab.create();

    grab.round = round;
    grab.player = player;
    grab.howMany = howMany;
    grab.timeTaken = timeTaken;
    grab.save();

    return grab.id;
  }
}

/* TODO:
- POST takeTurn()
- SSE checkIfNewRound => createRound
 */
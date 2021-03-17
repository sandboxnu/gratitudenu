import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Game } from '../entities/game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Round } from '../entities/round.entity';
import { GameSseService } from './game.sse.service';
import { Grab } from '../entities/grab.entity';
import { PlayersService } from '../players/players.service';
import { RoundService } from '../round/round.service';
import { SSEService } from '../sse/sse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Game, Round, Grab])],
  providers: [
    GameService,
    GameSseService,
    PlayersService,
    RoundService,
    SSEService,
  ],
  controllers: [GameController],
  exports: [TypeOrmModule],
})
export class GameModule {}

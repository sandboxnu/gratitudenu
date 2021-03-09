import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Game } from '../entities/game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Round } from '../entities/round.entity';
import { GameSseService } from './game.sse.service';
import { Grab } from '../entities/grab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Game, Round, Grab])],
  providers: [GameService, GameSseService],
  controllers: [GameController],
  exports: [TypeOrmModule],
})
export class GameModule {}

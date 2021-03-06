import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Game } from '../entities/game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Round } from '../entities/round.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Game, Round])],
  providers: [GameService],
  controllers: [GameController],
  exports: [TypeOrmModule],
})
export class GameModule {}

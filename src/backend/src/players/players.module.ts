import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Game } from '../entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Game])],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [TypeOrmModule],
})
export class PlayersModule {}

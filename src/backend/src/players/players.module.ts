import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { PlayersService } from './players.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayersService],
  exports: [TypeOrmModule],
})
export class PlayersModule {}

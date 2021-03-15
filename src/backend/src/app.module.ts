import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Grab } from './entities/grab.entity';
import { Player } from './entities/player.entity';
import { Round } from './entities/round.entity';
import { Game } from './entities/game.entity';
import { SSEService } from './sse/sse.service';
import { WaitingRoomSSEService } from './waiting-room/waiting-room.sse.service';
import { PlayersModule } from './players/players.module';
import { PlayersService } from './players/players.service';
import { AppController } from './app.controller';
import { WaitingRoomController } from './waiting-room/waiting-room.controller';
import { PlayersController } from './players/players.controller';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { RoundService } from './round/round.service';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV !== 'production' ? '.env.dev' : '.env',
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [Grab, Player, Round, Game],
      synchronize: true, // TODO: synchronize true should not be used in a production environment
    }),
    PlayersModule,
    GameModule,
  ],

  providers: [
    AppService,
    PlayersService,
    WaitingRoomSSEService,
    SSEService,
    GameService,
    RoundService,
  ],
  controllers: [
    AppController,
    WaitingRoomController,
    PlayersController,
    GameController,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}

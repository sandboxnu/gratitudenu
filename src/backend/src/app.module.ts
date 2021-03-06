import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Grab } from './entities/grab.entity';
import { Player } from './entities/player.entity';
import { Round } from './entities/round.entity';
import { Game } from './entities/game.entity';
import { WaitingRoomService } from './waiting-room/waiting-room.service';
import { SSEService } from './sse/sse.service';
import { WaitingRoomSSEService } from './waiting-room/waiting-room.sse.service';
import { PlayersModule } from './players/players.module';
import { PlayersService } from './players/players.service';
import { AppController } from './app.controller';
import { WaitingRoomController } from './waiting-room/waiting-room.controller';
import { PlayersController } from './players/players.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'my_database',
      entities: [Grab, Player, Round, Game],
      synchronize: true, // TODO: synchronize true should not be used in a production environment
    }),
    PlayersModule,
  ],
  providers: [
    AppService,
    PlayersService,
    WaitingRoomService,
    WaitingRoomSSEService,
    SSEService,
  ],
  controllers: [AppController, WaitingRoomController, PlayersController],
})
export class AppModule {
  constructor(private connection: Connection) {}
}

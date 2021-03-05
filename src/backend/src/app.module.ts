import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Grab } from './entities/grab.entity';
import { Player } from './entities/player.entity';
import { Round } from './entities/round.entity';
import { Game } from './entities/game.entity';
import { PlayersService } from './players/players.service';
import { PlayersModule } from './players/players.module';

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
  controllers: [AppController],
  providers: [AppService, PlayersService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}

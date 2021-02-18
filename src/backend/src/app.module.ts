import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { Grab } from './entities/grab.entity';
import { Player } from './entities/player.entity';
import { Round } from './entities/round.entity';
import { Game } from './entities/game.entity';
import { FormResponse } from './entities/formResponse.entity';
import { Question } from './entities/question.entity';
import { FormResponsesController } from './form-responses/form-responses.controller';
import { FormResponsesService } from './form-responses/form-responses.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'my_database',
      entities: [User, Grab, Player, Round, Game, FormResponse, Question],
      synchronize: true, // TODO: synchronize true should not be used in a production environment
    }),
    UsersModule,
  ],
  controllers: [AppController, UsersController, FormResponsesController],
  providers: [AppService, UsersService, FormResponsesService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}

import { PlayersService } from './players.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayersModule } from './players.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Grab } from '../entities/grab.entity';
import { Player } from '../entities/player.entity';
import { Round } from '../entities/round.entity';
import { Game } from '../entities/game.entity';
import { FormResponse } from '../entities/formResponse.entity';
import { Question } from '../entities/question.entity';

export const TestTypeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'my_database',
  entities: [User, Grab, Player, Round, Game, FormResponse, Question],
  synchronize: true,
});

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PlayersModule, TestTypeOrmModule],
      providers: [PlayersService],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

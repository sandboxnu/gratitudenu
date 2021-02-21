import { Test, TestingModule } from '@nestjs/testing';
import { FormResponsesController } from './form-responses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Grab } from '../entities/grab.entity';
import { Player } from '../entities/player.entity';
import { Round } from '../entities/round.entity';
import { Game } from '../entities/game.entity';
import { FormResponse } from '../entities/formResponse.entity';
import { Question } from '../entities/question.entity';
import { FormResponsesModule } from './form-responses.module';
import { FormResponsesService } from './form-responses.service';

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

describe('FormResponsesController', () => {
  let controller: FormResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FormResponsesModule, TestTypeOrmModule],
      controllers: [FormResponsesController],
      providers: [FormResponsesService],
    }).compile();

    controller = module.get<FormResponsesController>(FormResponsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

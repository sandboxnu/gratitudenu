import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormResponsesService } from './form-responses.service';
import { FormResponsesController } from './form-responses.controller';
import { FormResponse } from '../entities/formResponse.entity';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormResponse, User, Question])],
  providers: [FormResponsesService],
  controllers: [FormResponsesController],
  exports: [TypeOrmModule],
})
export class FormResponsesModule {}

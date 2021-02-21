import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from '../entities/question.entity';
import { FormResponse } from 'src/entities/formResponse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, FormResponse]),
    QuestionsModule,
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [TypeOrmModule],
})
export class QuestionsModule {}

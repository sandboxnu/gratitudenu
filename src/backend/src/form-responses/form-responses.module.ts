import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormResponsesService } from './form-responses.service';
import { FormResponsesController } from './form-responses.controller';
import { FormResponse } from '../entities/formResponse.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';
import { Question } from 'src/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormResponse, User, Question]),
    UsersModule,
  ],
  providers: [FormResponsesService],
  controllers: [FormResponsesController],
  exports: [TypeOrmModule],
})
export class FormResponsesModule {}

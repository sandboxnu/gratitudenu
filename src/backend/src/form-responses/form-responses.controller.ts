import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { FormResponse } from 'src/entities/formResponse.entity';
import { FormResponsesService } from './form-responses.service';

@Controller('form-responses')
export class FormResponsesController {
  constructor(private readonly formResponsesService: FormResponsesService) {}

  @Post()
  async create(
    @Body('userId') userId: number,
    @Body('questionId') questionId: number,
    @Body('answer') answer: string,
  ): Promise<FormResponse> {
    return this.formResponsesService.create(userId, questionId, answer);
  }
}

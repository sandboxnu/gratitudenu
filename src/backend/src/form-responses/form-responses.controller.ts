import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { FormResponse } from 'src/entities/formResponse.entity';

@Controller('form-responses')
export class FormResponsesController {
  @Post()
  async create(
    @Body('userId') userId: number,
    @Body('questionId') questionId: number,
    @Body('answer') answer: string,
  ): Promise<FormResponse> {
    const formResponse = new FormResponse();
    const user = await User.findOne(userId);
    const question = await Question.findOne(questionId);
    if (!user || !question) {
      throw new BadRequestException('Invalid userId or questionId');
    }
    formResponse.user = user;
    formResponse.question = question;
    await formResponse.save();
    return formResponse;
  }
}

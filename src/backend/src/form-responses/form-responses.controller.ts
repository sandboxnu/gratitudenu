import { Body, Controller, Post } from '@nestjs/common';
import { FormResponsesService } from './form-responses.service';
import { CreateFormResponseDto, CreateMultiFormResponsesDto } from './dto';

@Controller('form-responses')
export class FormResponsesController {
  constructor(private readonly formResponsesService: FormResponsesService) {}

  @Post()
  async create(
    @Body('userId') userId: number,
    @Body('questionId') questionId: number,
    @Body('formResponse') formResponseData: CreateFormResponseDto,
  ): Promise<number> {
    return this.formResponsesService.create(userId, formResponseData);
  }

  @Post('all')
  async createAll(
    @Body('userId') userId: number,
    @Body('formResponsesData') formResponsesData: CreateMultiFormResponsesDto,
  ): Promise<number> {
    return await this.formResponsesService.createMulti(
      userId,
      formResponsesData,
    );
  }
}

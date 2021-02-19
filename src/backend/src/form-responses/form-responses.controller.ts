import { Body, Controller, Post } from '@nestjs/common';
import { FormResponse } from 'src/entities/formResponse.entity';
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
  ): Promise<FormResponse> {
    return this.formResponsesService.create(
      userId,
      questionId,
      formResponseData,
    );
  }

  @Post('all')
  async createAll(
    @Body('userId') userId: number,
    @Body('formResponsesData') formResponsesData: CreateMultiFormResponsesDto,
  ) {
    return await this.formResponsesService.createMulti(
      userId,
      formResponsesData,
    );
  }
}

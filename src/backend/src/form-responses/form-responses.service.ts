import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormResponse } from '../entities/formResponse.entity';

@Injectable()
export class FormResponsesService {
  constructor(
    @InjectRepository(FormResponse)
    private formResponsesRepository: Repository<FormResponse>,
  ) {}

  getAllFormResponses(): Promise<FormResponse[]> {
    return this.formResponsesRepository.find({ relations: ['user'] });
  }

  async getFormResponseByUserId(id: number) {
    const formResponse = await this.formResponsesRepository.findOne(id);
    if (!formResponse) {
      throw new BadRequestException('Form response not found');
    }
    return formResponse;
  }

  async updateFormResponse(id: number, answer: string) {
    const formResponse = await this.formResponsesRepository.findOne(id);
    if (!formResponse) {
      throw new BadRequestException('Form response not found');
    }
    formResponse.answer = answer;
    await this.formResponsesRepository.update(id, formResponse);
    const updatedFormResponse = await this.formResponsesRepository.findOne(id);
    if (!updatedFormResponse) {
      throw new BadRequestException('Update failed');
    }
    return updatedFormResponse;
  }
}

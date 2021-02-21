import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormResponse } from '../entities/formResponse.entity';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';
import { CreateFormResponseDto, CreateMultiFormResponsesDto } from './dto';

@Injectable()
export class FormResponsesService {
  constructor(
    @InjectRepository(FormResponse)
    private formResponsesRepository: Repository<FormResponse>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async findAll(): Promise<FormResponse[]> {
    return this.formResponsesRepository.find();
  }

  async findOne(id: number): Promise<FormResponse> {
    const formResponse = await this.formResponsesRepository.findOne(id);
    if (!formResponse) {
      throw new BadRequestException('Form response not found');
    }
    return formResponse;
  }

  async update(id: number, answer: string): Promise<FormResponse> {
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

  async create(
    userId: number,
    formResponseData: CreateFormResponseDto,
  ): Promise<number> {
    const [questionId, answer] = formResponseData.questionAnswerPair;
    let formResponse = new FormResponse();
    formResponse.answer = answer;
    const question = await this.questionsRepository.findOne(questionId);
    formResponse.question = question;
    await this.formResponsesRepository.save(formResponse);

    const user = await this.usersRepository.findOne(userId);
    user.formResponses.push(formResponse);
    await this.usersRepository.save(user);

    return formResponse.id;
  }

  // TODO: check question exists, userId hasn't answered already.
  async createMulti(
    userId: number,
    formResponsesData: CreateMultiFormResponsesDto,
  ): Promise<number> {
    const user = await this.usersRepository.findOne(userId);
    formResponsesData.questionAnswerPairs.forEach(
      async (questionAnswerPair) => {
        const [questionId, answer] = questionAnswerPair;
        let formResponse = new FormResponse();
        formResponse.answer = answer;
        const question = await this.questionsRepository.findOne(questionId);
        formResponse.question = question;
        await this.formResponsesRepository.save(formResponse);

        user.formResponses.push(formResponse);
      },
    );
    await this.usersRepository.save(user);
    return user.id;
  }
}

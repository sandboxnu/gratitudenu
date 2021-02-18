import { Test, TestingModule } from '@nestjs/testing';
import { FormResponsesService } from './form-responses.service';

describe('FormResponsesService', () => {
  let service: FormResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormResponsesService],
    }).compile();

    service = module.get<FormResponsesService>(FormResponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

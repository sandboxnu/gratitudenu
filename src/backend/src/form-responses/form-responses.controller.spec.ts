import { Test, TestingModule } from '@nestjs/testing';
import { FormResponsesController } from './form-responses.controller';

describe('FormResponsesController', () => {
  let controller: FormResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormResponsesController],
    }).compile();

    controller = module.get<FormResponsesController>(FormResponsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

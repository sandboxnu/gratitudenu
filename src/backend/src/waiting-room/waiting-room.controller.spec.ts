import { Test, TestingModule } from '@nestjs/testing';
import { WaitingRoomController } from './waiting-room.controller';

describe('WaitingRoomController', () => {
  let controller: WaitingRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingRoomController],
    }).compile();

    controller = module.get<WaitingRoomController>(WaitingRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WaitingRoomService } from './waiting-room.service';

describe('WaitingRoomService', () => {
  let service: WaitingRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingRoomService],
    }).compile();

    service = module.get<WaitingRoomService>(WaitingRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

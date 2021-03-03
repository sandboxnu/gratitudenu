import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { WaitingRoomService } from './waiting-room.service';
import { WaitingRoomSSEService } from './waiting-room.sse.service';

@Controller('waiting-room')
export class WaitingRoomController {
  constructor(
    private waitingRoomService: WaitingRoomService,
    private waitingRoomSseService: WaitingRoomSSEService,
  ) {}

  @Post()
  async addPlayerToRoom(
    @Body('playerId') playerId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    });
    this.waitingRoomSseService.subscribeClient(res, {
      userId: playerId,
      emotionId: 1,
    });
  }
}

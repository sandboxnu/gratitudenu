import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PlayersModule } from 'src/players/players.module';
import { PlayersService } from 'src/players/players.service';
import { WaitingRoomSSEService } from './waiting-room.sse.service';

@Controller('waiting-room')
export class WaitingRoomController {
  constructor(
    private playerService: PlayersService,
    private waitingRoomSseService: WaitingRoomSSEService,
  ) {}

  @Post()
  async addPlayerToRoom(
    @Body('playerId') playerId: number,
    @Res() res: Response,
  ): Promise<void> {
    const player = await this.playerService.findOne(playerId);
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    });

    this.waitingRoomSseService.subscribeClient(res, {
      userId: playerId,
      emotionId: player.emotionId,
    });
  }
}

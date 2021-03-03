import { Body, Controller, Post, Res } from '@nestjs/common';
import { WaitingRoomService } from './waiting-room.service';

@Controller('waiting-room')
export class WaitingRoomController {
  constructor(private waitingRoomService: WaitingRoomService) {}

  @Post()
  async addPlayerToRoom(
    @Body('playerId') playerId: string,
    @Res() res: Response,
  ) {}
}

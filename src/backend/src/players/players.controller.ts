import { BadRequestException, Body, Post } from '@nestjs/common';
import { Player } from '../entities/player.entity';

@Controller('players')
export class PlayersController {
  @Post()
  async create(
    @Body('userId') userId: number,
    @Body('emotionId') emotionId: number,
  ): Promise<number> {
    if (!userId || !emotionId) {
      throw new BadRequestException('Not all player fields are filled');
    }
    const player = await Player.create({
      userId,
      emotionId,
    }).save();

    return player.userId;
  }
}

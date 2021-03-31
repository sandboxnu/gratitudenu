import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Player, EmotionIdEnum } from '../entities/player.entity';

@Controller('players')
export class PlayersController {
  @Post()
  async create(
    @Body('userId') userId: number,
    @Body('emotionId') emotionId: number,
  ): Promise<number> {
    if (!userId || !emotionId) {
      throw new BadRequestException(
        'Create Player requires emotionId and userId',
      );
    }
    if (!Object.values(EmotionIdEnum).includes(emotionId)) {
      throw new BadRequestException('EmotionId has to be either 0 or 1');
    }
    const player = await Player.create({
      userId,
      emotionId,
    }).save();

    return player.id;
  }
}

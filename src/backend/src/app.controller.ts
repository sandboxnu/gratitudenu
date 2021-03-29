import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from './entities/game.entity';
import { Grab } from './entities/grab.entity';
import { Player } from './entities/player.entity';
import { Round } from './entities/round.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('db')
  async tearDownDb(@Body('password') password: string): Promise<boolean> {
    if (process.env.DELETE_PASSWORD !== password) {
      throw new BadRequestException('Password is not correct');
    }
    await Game.delete({});
    await Grab.delete({});
    await Player.delete({});
    await Round.delete({});

    return true;
  }
}

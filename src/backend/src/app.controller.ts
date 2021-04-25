import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from './entities/game.entity';
import { Grab } from './entities/grab.entity';
import { Player } from './entities/player.entity';
import { Round } from './entities/round.entity';
import { Setting } from './entities/setting.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return 'hi';
  }

  @Delete('db')
  async tearDownDb(@Body('password') password: string): Promise<boolean> {
    if (process.env.DELETE_PASSWORD !== password) {
      console.log(password);
      console.log(process.env.DELETE_PASSWORD);
      throw new BadRequestException('Password is not correct');
    }

    await Grab.delete({});
    await Round.delete({});
    await Player.delete({});
    await Game.delete({});

    return true;
  }
}

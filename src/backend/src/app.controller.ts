import { Controller, Delete, Get } from '@nestjs/common';
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
  async tearDownDb(): Promise<boolean> {
    await Game.delete({});
    await Grab.delete({});
    await Player.delete({});
    await Round.delete({});

    return true;
  }
}

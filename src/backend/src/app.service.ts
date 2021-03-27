import { Injectable } from '@nestjs/common';
import { Setting } from './entities/setting.entity';

const DEFAULT_PLAYERS = 4;
const DEFAULT_ROUNDS = 10;
@Injectable()
export class AppService {
  async initializeSettings(): Promise<void> {
    const playerSetting = await Setting.findOne('PLAYERS');
    const roundSetting = await Setting.findOne('ROUND');
    if (!playerSetting) {
      playerSetting.value = DEFAULT_PLAYERS;

      await playerSetting.save();
    }
    if (!roundSetting) {
      roundSetting.value = DEFAULT_ROUNDS;

      await roundSetting.save();
    }
  }
}

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
      await Setting.create({
        settingName: 'PLAYERS',
        value: DEFAULT_PLAYERS,
      }).save();
    }
    if (!roundSetting) {
      await Setting.create({
        settingName: 'ROUND',
        value: DEFAULT_ROUNDS,
      }).save();
    }
  }
}

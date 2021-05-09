import { Injectable } from '@nestjs/common';
import { Setting } from './entities/setting.entity';

const DEFAULT_PLAYERS = 4;
const DEFAULT_ROUNDS = 10;
const DEFAULT_ROUND_TIMER_IN_SECONDS = 15;
const DEFAULT_WAITING_ROOM_TIMER_IN_SECONDS = 180000;
@Injectable()
export class AppService {
  async initializeSettings(): Promise<void> {
    const playerSetting = await Setting.findOne('PLAYERS');
    const roundSetting = await Setting.findOne('ROUND');
    const roundTimerSetting = await Setting.findOne('ROUND_TIMER');
    const waitingRoomTimerSetting = await Setting.findOne('WAITING_ROOM_TIMER');
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
    if (!roundTimerSetting) {
      await Setting.create({
        settingName: 'ROUND_TIMER',
        value: DEFAULT_ROUND_TIMER_IN_SECONDS,
      }).save();
    }
    if (!waitingRoomTimerSetting) {
      await Setting.create({
        settingName: 'WAITING_ROOM_TIMER',
        value: DEFAULT_WAITING_ROOM_TIMER_IN_SECONDS,
      }).save();
    }
  }
}

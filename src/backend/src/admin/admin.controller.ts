import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { Setting } from 'src/entities/setting.entity';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getSetting(
    @Query('settingName') settingName: string,
  ): Promise<number | null> {
    const setting = await Setting.findOne(settingName);

    return setting ? setting.value : null;
  }

  @Patch('setting')
  async updateSetting(
    @Body('settingName') settingName: string,
    @Body('value') value: number,
    @Body('password') password: string,
  ): Promise<number> {
    this.adminService.verifyPassword(password);

    let setting = await Setting.findOne(settingName);
    if (!setting) {
      setting = await Setting.create({ settingName, value }).save();
    } else {
      setting.value = value;
      await setting.save();
    }
    return setting.value;
  }
}

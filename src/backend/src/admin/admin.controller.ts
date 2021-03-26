import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { Setting } from 'src/entities/setting.entity';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getSetting(@Query('settingName') settingName: string): Promise<number> {
    const setting = await Setting.findOne(settingName);

    return setting?.value;
  }

  @Patch('setting')
  async updateSetting(
    @Body('settingName') settingName: string,
    @Body('newValue') value: number,
    @Body('password') password: string,
  ): Promise<number> {
    this.adminService.verifyPassword(password);

    let setting = await Setting.findOne(settingName);
    if (!setting) {
      setting = Setting.create({ settingName });
    }
    setting.value = value;
    setting.save();
    return setting.value;
  }
}

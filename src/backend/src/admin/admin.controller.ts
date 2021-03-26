import { Body, Controller, Patch } from '@nestjs/common';
import { Setting } from 'src/entities/setting.entity';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

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

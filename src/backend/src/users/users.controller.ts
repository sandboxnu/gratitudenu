import { Body, Controller, Param, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  @Post()
  async create(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('age') age: number,
    @Body('consentFormFilled') consentFormFilled: boolean,
  ): Promise<number> {
    const user = await User.create({
      firstName,
      lastName,
      age,
      consentFormFilled,
    }).save();
    return user.id;
  }
}

import { Controller, Param, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  @Post()
  create(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
    @Param('age') age: number,
    @Param('consentFormFilled') consentFormFilled: boolean,
  ): number {
    const user = User.create({ firstName, lastName, age, consentFormFilled });
    return user.id;
  }
}

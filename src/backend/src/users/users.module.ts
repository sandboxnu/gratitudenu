import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { FormResponse } from '../entities/formResponse.entity';
import { FormResponsesModule } from '../form-responses/form-responses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FormResponse]),
    FormResponsesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UsersModule {}

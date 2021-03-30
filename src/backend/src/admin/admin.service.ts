import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  verifyPassword(password: string): void {
    const realPassword = process.env.EXPORT_PASSWORD;

    if (realPassword !== password) {
      throw new BadRequestException('Incorrect Password');
    }
  }
}

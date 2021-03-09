import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from '../entities/round.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
  ) {}

  async findOne(id: number): Promise<Round> {
    const round = this.roundRepository.findOne(id);
    if (!round) {
      return;
    }
    return round;
  }
}

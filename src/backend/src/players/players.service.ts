import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  async findOne(id: number): Promise<Player> {
    const player = this.playersRepository.findOne(id);
    if (!player) {
      throw new BadRequestException('Player not found');
    }
    return player;
  }

  // Not sure if I should be taking these in or userId, gameId?
  async create(userId: number, gameId: number, color: string): Promise<Number> {
    let player = new Player();
    player.color = color;

    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Set game by using gamesRepository.findOne() => does not exist

    await this.playersRepository.save(player);

    return player.id;
  }
}

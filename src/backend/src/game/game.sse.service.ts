import { Client, SSEService } from '../sse/sse.service';
import { Response } from 'express';
import { GameService } from './game.service';
import { Round } from '../entities/round.entity';
import { RoundService } from '../round/round.service';
import { Injectable } from '@nestjs/common';

type GameClientMetadata = { playerId: number; gameId: number };
const MAX_PLAYERS = 2; // TODO: test temp

@Injectable()
export class GameSseService {
  private clients: Record<number, Client<GameClientMetadata>[]> = {};
  constructor(
    private gameService: GameService,
    private roundService: RoundService,
    private sseService: SSEService<GameClientMetadata>,
  ) {}

  /**
   * Subscribe a Client to the Game
   * @param res
   * @param metadata
   */
  async subscribeClient(
    res: Response,
    metadata: GameClientMetadata,
  ): Promise<void> {
    this.sseService.subscribeClient(metadata.gameId, { res, metadata });
  }

  endGame(gameId: number) {
    // Also send final results
    this.sseService.sendEvent(gameId, 'The game is over');
    this.sseService.unsubscribeRoom(gameId);
  }

  async updateGameWithRoundResults(
    gameId: number,
    roundId: number,
  ): Promise<void> {
    const game = await this.gameService.findOne(gameId);
    const round = await this.roundService.findOne(roundId);
    const adjustedTotal: number = await this.gameService.getSumPoints(roundId);
    const newRound = await this.roundService.create(
      adjustedTotal,
      round.roundNumber,
      game,
    );
    this.sseService.sendEvent(gameId, { newRound });
  }
}

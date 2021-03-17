import { Client, SSEService } from '../sse/sse.service';
import { Response } from 'express';
import { GameService } from './game.service';
import { Round } from '../entities/round.entity';
import { RoundService } from '../round/round.service';
import { Injectable } from '@nestjs/common';

type GameClientMetadata = { playerId: number; gameId: number };

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
    this.sseService.sendEvent(gameId, {
      endMessage: 'The game is over',
    });
    this.sseService.unsubscribeRoom(gameId);
  }

  updateGameWithRoundResults(gameId: number, newRound: Round): void {
    this.sseService.sendEvent(gameId, { newRound });
  }
}

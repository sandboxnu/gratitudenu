import { Client, SSEService } from '../sse/sse.service';
import { Response } from 'express';
import { GameService } from './game.service';
import { Round } from '../entities/round.entity';
import { RoundService } from '../round/round.service';

type GameClientMetadata = { playerId: number; gameId: number; roundId: number };
const MAX_PLAYERS = 2; // TODO: test temp

export class GameSseService {
  private clients: Record<number, Client<GameClientMetadata>[]> = {}; // TODO: fix this type
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
    // TODO: use gameID to get clients
    const sumPoints = (acc, cur: Client<GameClientMetadata>) =>
      acc + this.gameService.getPoints(cur.metadata.playerId);
    const totalTake: number = clients.reduce(sumPoints, 0);

    const game = await this.gameService.findOne(clients[0].metadata.gameId);
    const round = await this.roundService.findOne(clients[0].metadata.roundId);

    // TODO: make newRound somewhere else, sumPoints
    const newRound = Round.create({
      roundNumber: round.roundNumber + 1,
      pointsRemaining: round.pointsRemaining - 0.9 * totalTake, // TODO: this probably isn't right
      playerMoves: [],
      game,
    });

    await newRound.save();

    this.sseService.sendEvent(gameId, { newRound });
  }
}

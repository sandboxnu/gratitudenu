import { Client } from '../sse/sse.service';
import { Response } from 'express';
import { GameService } from './game.service';
import { Round } from '../entities/round.entity';
import { RoundService } from '../round/round.service';

type GameClientMetadata = { playerId: number; gameId: number; roundId: number };
const MAX_PLAYERS = 4;

export class GameSseService {
  private clients: Record<number, Client<GameClientMetadata>[]> = {}; // TODO: fix this type
  constructor(
    private gameService: GameService,
    private roundService: RoundService,
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
    if (!(metadata.gameId in this.clients)) {
      this.clients[metadata.gameId] = [];
    }
    //
    // if(!(metadata.roundId in this.clients[metadata.gameId])) {
    //   this.clients[metadata.gameId][metadata.roundId] = [];
    // }

    this.clients[metadata.gameId].push({ res, metadata });

    const currRoundPlayers = this.clients[metadata.gameId].filter(
      (client) => client.metadata.roundId === metadata.roundId,
    );
    if (currRoundPlayers.length === MAX_PLAYERS) {
      await this.updateGameWithRoundResults(currRoundPlayers);
    }
  }

  async updateGameWithRoundResults(
    clients: Client<GameClientMetadata>[],
  ): Promise<void> {
    const sumPoints = (acc, cur: Client<GameClientMetadata>) =>
      acc + this.gameService.getPoints(cur.metadata.playerId);
    const totalTake: number = clients.reduce(sumPoints, 0);

    const game = await this.gameService.findOne(clients[0].metadata.gameId);
    const round = await this.roundService.findOne(clients[0].metadata.roundId);

    const newRound = Round.create({
      roundNumber: round.roundNumber + 1, // TODO: DO WE NEED A ROUND NUMBER
      pointsRemaining: round.pointsRemaining - totalTake,
      playerMoves: [],
      game,
    });

    await newRound.save();

    this.sendMessage({ totalTake, newRound }, clients);
  }

  /**
   * Send message to clients
   * @param message
   * @param clients
   */
  private sendMessage(message: any, clients: Client<GameClientMetadata>[]) {
    for (const { res } of clients) {
      const toSend = `data: ${JSON.stringify(message)}\n\n`;
      res.write(toSend);
    }
  }
}

// @Sse('sse')
// async checkIfNewRound(
//   @Body('roundId') roundId: number,
// ): Promise<Observable<MessageEvent>> {
//   const round = await this.roundsRepository.findOne(roundId);
//   if (!round) {
//   throw new BadRequestException('Round does not exist');
// }
// const isNewRound = round.playerMoves.length == 4;
// return interval(1000).pipe(
//   map((_) => ({ data: { isNewRound: isNewRound } })),
// );
// }

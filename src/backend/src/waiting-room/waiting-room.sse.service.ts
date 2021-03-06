import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { GameService } from 'src/game/game.service';
import { Client } from 'src/sse/sse.service';

type WaitingRoomClientMetadata = { playerId: number; emotionId: number };
const FIFTEEN_MINUTES = 900000;
const TIMEOUT_EVENT = { timeout: true };
const MAX_PLAYERS = 4;
/**
 * Handle sending Waiting Room sse events
 */
@Injectable()
export class WaitingRoomSSEService {
  private clients: Record<string, Client<WaitingRoomClientMetadata>[]> = {};
  constructor(private gameService: GameService) {}
  /**
   * Subscribe a Client to the Waiting Room
   * @param res
   * @param metadata
   */
  async subscribeClient(
    res: Response,
    metadata: WaitingRoomClientMetadata,
  ): Promise<void> {
    if (!(metadata.emotionId in this.clients)) {
      this.clients[metadata.emotionId] = [];
    }
    // Start Timer to remove player
    setTimeout(() => this.clientTimerFunction(metadata), FIFTEEN_MINUTES);
    // Add Client to emotion room
    this.clients[metadata.emotionId].push({ res, metadata });

    if (this.clients[metadata.emotionId].length === MAX_PLAYERS) {
      await this.sendClientsToGame(this.clients[metadata.emotionId]);
      delete this.clients[metadata.emotionId];
    } else {
      this.updateEmotionRoomWithNumberOfPlayers(
        this.clients[metadata.emotionId],
      );
    }
  }

  clientTimerFunction(client: WaitingRoomClientMetadata): void {
    const clients = this.clients[client.emotionId];
    const index = this.clients[client.emotionId]?.findIndex(
      (cli) => cli.metadata.playerId === client.playerId,
    );
    if (clients && index !== undefined) {
      const cli = this.clients[client.emotionId][index];
      this.sendMessage(TIMEOUT_EVENT, [cli]);
      clients.splice(index, 1);
      this.updateEmotionRoomWithNumberOfPlayers(clients);
      cli.res.end();
    }
  }

  /**
   * Update Room with number of players waiting for games
   * @param clients
   */
  updateEmotionRoomWithNumberOfPlayers(
    clients: Client<WaitingRoomClientMetadata>[],
  ): void {
    this.sendMessage({ players: clients.length }, clients);
  }

  /**
   * Send clients to game room
   * @param clients
   */
  async sendClientsToGame(
    clients: Client<WaitingRoomClientMetadata>[],
  ): Promise<void> {
    // create game with the given clients
    const playerIds = clients.map((client) => client.metadata.playerId);
    const gameId = await this.gameService.create(playerIds);
    // send each client the game id
    this.sendMessage({ gameId }, clients);

    // close each client connection
    for (const { res } of clients) {
      res.end();
    }
  }

  /**
   * Send message to clients
   * @param message
   * @param clients
   */
  private sendMessage(
    message: any,
    clients: Client<WaitingRoomClientMetadata>[],
  ) {
    for (const { res } of clients) {
      const toSend = `data: ${JSON.stringify(message)}\n\n`;
      res.write(toSend);
    }
  }
}

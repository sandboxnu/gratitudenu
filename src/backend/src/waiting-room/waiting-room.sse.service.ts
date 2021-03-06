import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { WaitingRoomService } from './waiting-room.service';
import { Client } from 'src/sse/sse.service';

type WaitingRoomClientMetadata = { userId: number; emotionId: number };
const FIFTEEN_MINUTES = 10000;
const TIMEOUT_EVENT = { timeout: true };
const MAX_PLAYERS = 3; //TODO: Test with real number (i just don't know a rest test other than postman and insomnia)
/**
 * Handle sending Waiting Room sse events
 */
@Injectable()
export class WaitingRoomSSEService {
  private clients: Record<string, Client<WaitingRoomClientMetadata>[]> = {};
  constructor(private waitingRoomService: WaitingRoomService) {}

  /**
   * Subscribe a Client to the Waiting Room
   * @param res
   * @param metadata
   */
  subscribeClient(res: Response, metadata: WaitingRoomClientMetadata): void {
    if (!(metadata.emotionId in this.clients)) {
      this.clients[metadata.emotionId] = [];
    }
    // Start Timer to remove player
    setTimeout(() => this.clientTimerFunction(metadata), FIFTEEN_MINUTES);
    // Add Client to emotion room
    this.clients[metadata.emotionId].push({ res, metadata });

    if (this.clients[metadata.emotionId].length === MAX_PLAYERS) {
      this.sendClientsToGame(this.clients[metadata.emotionId]);
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
      (cli) => cli.metadata.userId === client.userId,
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
  sendClientsToGame(clients: Client<WaitingRoomClientMetadata>[]): void {
    // create game with the given clients
    //TODO: real value
    const gameId = 'abc';
    // send each client the game id
    this.sendMessage({ gameId }, clients);

    // close each client connection
    for (const { res } of clients) {
      res.end();
    }
  }

  /**
   *
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

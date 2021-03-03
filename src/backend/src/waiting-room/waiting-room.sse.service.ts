import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { WaitingRoomService } from './waiting-room.service';
import { Client } from 'src/sse/sse.service';

type WaitingRoomClientMetadata = { userId: number; emotionId: number };
const FIFTEEN_MINUTES = 900000;
const MAX_PLAYERS = 2; //TODO: Test with real number (i just don't know a rest test other than postman and insomnia)
/**
 * Handle sending queue sse events
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
    //TODO: Start timer
    this.clients[metadata.emotionId].push({ res, metadata });

    if (this.clients[metadata.emotionId].length === MAX_PLAYERS) {
      this.sendClientsToGame(this.clients[metadata.emotionId]);
      delete this.clients[metadata.emotionId];
    }
  }

  /**
   * Send
   * @param clients
   */
  sendClientsToGame(clients: Client<WaitingRoomClientMetadata>[]) {
    // create game with the given clients
    //TODO: real value
    const gameId = 'abc';
    // send each client the game id
    this.sendGameId(gameId, clients);
    // cancel each clients timer
  }

  sendGameId(gameId: string, clients: Client<WaitingRoomClientMetadata>[]) {
    for (const { res, metadata } of clients) {
      const toSend = `data: ${JSON.stringify({ gameId })}\n\n`;
      res.write(toSend);
      res.end();
    }
  }
}

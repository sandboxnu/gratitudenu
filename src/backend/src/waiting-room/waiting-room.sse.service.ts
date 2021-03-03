import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { throttle } from 'lodash';
import { WaitingRoomService } from './waiting-room.service';
import { Client, SSEService } from 'src/sse/sse.service';

type WaitingRoomClientMetadata = { userId: string; emotionId: string };
const FIFTEEN_MINUTES = 900000;
const MAX_PLAYERS = 4;
/**
 * Handle sending queue sse events
 */
@Injectable()
export class WaitingRoomSSEService {
  private clients: Record<string, Client<WaitingRoomClientMetadata>[]> = {};
  constructor(private waitingRoomService: WaitingRoomService) {}

  subscribeClient(res: Response, metadata: WaitingRoomClientMetadata) {
    if (!(metadata.emotionId in this.clients)) {
      this.clients[metadata.emotionId] = [];
    }
    this.clients[metadata.emotionId].push({ res, metadata });

    if (this.clients[metadata.emotionId].length === MAX_PLAYERS) {
      this.sendClientsToGame(this.clients[metadata.emotionId]);
      delete this.clients[metadata.emotionId];
    }
  }

  sendClientsToGame(clients: Client<WaitingRoomClientMetadata>[]) {
    // create game with the given clients
    //
  }
}

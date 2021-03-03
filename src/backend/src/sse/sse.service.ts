import { Injectable } from '@nestjs/common';
import { Response } from 'express';

export interface Client<T> {
  metadata: T;
  res: Response;
}
/**
 * T is metadata associated with each Client
 *
 * Low level abstraction for sending SSE to "rooms" of clients.
 * Probably don't use this directly, and wrap it in a service specific to that event source
 */
@Injectable()
export class SSEService<T> {
  private clients: Record<any, Client<T>[]> = {};

  /** Add a client to a room */
  // For Game, room is gameId, if this is the waiting room then we can use 'waiting-room' as the key
  subscribeClient(room: string, client: Client<T>): void {
    // Keep track of responses so we can send sse through them
    if (!(room in this.clients)) {
      this.clients[room] = [];
    }
    const roomref = this.clients[room];
    roomref.push(client);

    // Remove dead connections!
    client.res.socket.on('end', () => {
      roomref.splice(roomref.indexOf(client), 1);
    });
  }

  unsubscribeClient(
    room: string,
    matchClient: (client: Client<T>) => boolean,
  ): void {
    const cli = this.clients[room];
    cli.find(matchClient)?.res.end();
  }

  /** Send some data to everyone in a room */
  sendEvent<D>(room: string, payload: (metadata: T) => D): void {
    if (room in this.clients) {
      for (const { res, metadata } of this.clients[room]) {
        const toSend = `data: ${JSON.stringify(payload(metadata))}\n\n`;
        res.write(toSend);
      }
    }
  }
}

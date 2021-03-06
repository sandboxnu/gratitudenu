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

  unsubscribeRoom(room: string): void {
    const cli = this.clients[room];
    delete this.clients[room];
    cli.forEach((client) => client.res.end());
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

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/no-internal-modules */
/* eslint-disable id-blacklist */
import { injectable } from 'inversify';
import { makeObservable, observable, runInAction } from 'mobx';

import { Exchange } from '../../../models';
import { ConnectorBase, IDeal, IInstrument, IOrderBook, MessageRouter } from '../../abstractions';
import { Deal, Instrument, OrderBook, Trade } from '../models';
import { mapDeals, mapInstruments, mapOrderBook, mapTrades } from './mappings';

type Subscription = {
  id: number;
  method: string;
  params: string[];
};

type StreamEvent<T = unknown> = {
  stream: string | undefined;
  data: T;
};

const eventMap = {
  orderBook: (e: StreamEvent) => e as StreamEvent<OrderBook>,
  trade: (e: StreamEvent) => e as StreamEvent<Trade>,
  other: (_: StreamEvent) => ({}),
};

@injectable()
export class Connector extends ConnectorBase {
  public readonly exchange: Exchange = Exchange.Binance;
  @observable
  public isReady = false;

  private readonly socket: WebSocket = new WebSocket('wss://stream.binance.com:9443/stream');
  private messageRouter: MessageRouter<StreamEvent, typeof eventMap>;
  private static socketRequestId = 0;

  constructor() {
    super();
    makeObservable(this);
    this.messageRouter = new MessageRouter(
      (x) => JSON.parse(x.data) as StreamEvent,
      (x) => {
        if (!x.stream) {
          return 'other';
        }
        if (
          x.stream.includes('@depth') &&
          x.stream.indexOf('@depth') !== x.stream.length - 6 &&
          !x.stream.includes('@depth@')
        ) {
          return 'orderBook';
        }
        if (x.stream.includes('@trade')) return 'trade';
        return 'other';
      },
      eventMap,
    );
    this.socket.onmessage = (e) => this.messageRouter.process(e);
    this.socket.onopen = () => {
      runInAction(() => {
        this.isReady = true;
      });
    };
  }

  private static generateId(): number {
    return ++this.socketRequestId;
  }

  async loadInstruments(): Promise<IInstrument[]> {
    return fetch('https://api.binance.com/api/v3/ticker/bookTicker')
      .then((res) => res.json())
      .then((json: Instrument[]) => json.map((item): IInstrument => mapInstruments(item)));
  }

  async getRecentTrades(inst: string): Promise<IDeal[]> {
    return fetch(`https://api.binance.com/api/v3/trades?symbol=${inst}`)
      .then((res) => res.json())
      .then((json: Deal[]) => json.map((item: Deal): IDeal => mapDeals(item)));
  }

  subscribeOrderBook(name: string, callback: (data: IOrderBook) => void): () => void {
    const symbol: string = name.toLowerCase();
    const stream = `${symbol}@depth20@100ms`;
    const subscription: Subscription = {
      method: 'SUBSCRIBE',
      params: [stream],
      id: Connector.generateId(),
    };
    this.socket.send(JSON.stringify(subscription));

    const unsubscribe = this.messageRouter.subscribe('orderBook', (x) => {
      if (x.stream === stream) {
        callback(mapOrderBook(x.data));
      }
    });

    return () => {
      const unsubscription: Subscription = {
        method: 'UNSUBSCRIBE',
        params: [stream],
        id: subscription.id,
      };

      this.socket.send(JSON.stringify(unsubscription));

      unsubscribe();
    };
  }

  subscribeTradesStream(name: string, callback: (data: IDeal) => void): () => void {
    const symbol: string = name.toLowerCase();
    const stream = `${symbol}@trade`;
    const subscription: Subscription = {
      method: 'SUBSCRIBE',
      params: [stream],
      id: Connector.generateId(),
    };
    this.socket.send(JSON.stringify(subscription));

    const unsubscribe = this.messageRouter.subscribe('trade', (x) => {
      if (x.stream === stream) {
        callback(mapTrades(x.data));
      }
    });

    return () => {
      const unsubscription: Subscription = {
        method: 'UNSUBSCRIBE',
        params: [stream],
        id: subscription.id,
      };

      this.socket.send(JSON.stringify(unsubscription));

      unsubscribe();
    };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable id-blacklist */
import { injectable } from 'inversify';
import { makeObservable, observable, runInAction } from 'mobx';

import { Exchange } from '../../../models';
import { ConnectorBase, IDeal, IInstrument, IOrderBook, MessageRouter } from '../../abstractions';
import { Deal, OrderBook, Trade } from '../models';
import { mapDeals, mapInstruments, mapOrderBook, mapTrades } from './mappings';

type Subscription = {
  id: number;
  method: string;
  topics: string[];
};

type StreamEvent<T = unknown> = {
  ts: string;
  event: string;
  topic: string;
  data: T;
};

type jsonDeal = {
  [key: string]: Deal[];
};

const eventMap = {
  orderBook: (e: StreamEvent) => e as StreamEvent<OrderBook>,
  trade: (e: StreamEvent) => e as StreamEvent<Array<Trade>>,
  other: (_: StreamEvent) => ({}),
};

@injectable()
export class Connector extends ConnectorBase {
  public readonly exchange: Exchange = Exchange.Exmo;
  @observable
  public isReady = false;

  private readonly socket: WebSocket = new WebSocket('wss://ws-api.exmo.com:443/v1/public');
  private messageRouter: MessageRouter<StreamEvent, typeof eventMap>;
  private static socketRequestId = 0;

  constructor() {
    super();
    makeObservable(this);
    this.messageRouter = new MessageRouter(
      (x) => JSON.parse(x.data) as StreamEvent,
      (x) => {
        if (x.event === 'error') {
          // ошибка
          return 'other';
        }
        if (x.event === 'subscribed') {
          // удачное подключение
          return 'other';
        }
        if (x.event === 'update') {
          // при обновлении данных
          if (x.topic.includes('order_book_snapshots')) {
            return 'orderBook';
          }
          if (x.topic.includes('trades')) {
            return 'trade';
          }
        }
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
    return fetch('https://api.exmo.com/v1.1/ticker')
      .then((res) => res.json())
      .then((json) => mapInstruments(json));
  }

  async getRecentTrades(inst: string): Promise<IDeal[]> {
    return fetch(`https://api.exmo.com/v1.1/trades?pair=${inst}`)
      .then((res) => res.json())
      .then((json: jsonDeal) => json[inst].map((item: Deal): IDeal => mapDeals(item)));
  }

  subscribeOrderBook(name: string, callback: (data: IOrderBook) => void): () => void {
    const stream = `spot/order_book_snapshots:${name}`;
    const subscription: Subscription = {
      id: Connector.generateId(),
      method: 'subscribe',
      topics: [stream],
    };
    this.socket.send(JSON.stringify(subscription));

    const unsubscribe = this.messageRouter.subscribe('orderBook', (x) => {
      if (x.topic === stream) {
        callback(mapOrderBook(x.data));
      }
    });

    return () => {
      const unsubscription: Subscription = {
        id: subscription.id,
        method: 'unsubscribe',
        topics: [stream],
      };

      this.socket.send(JSON.stringify(unsubscription));

      unsubscribe();
    };
  }

  subscribeTradesStream(name: string, callback: (data: IDeal) => void): () => void {
    const stream = `spot/trades:${name}`;
    const subscription: Subscription = {
      id: Connector.generateId(),
      method: 'subscribe',
      topics: [stream],
    };
    this.socket.send(JSON.stringify(subscription));

    const unsubscribe = this.messageRouter.subscribe('trade', (x) => {
      if (x.topic === stream) {
        callback(mapTrades(x.data[0]));
      }
    });

    return () => {
      const unsubscription: Subscription = {
        id: subscription.id,
        method: 'unsubscribe',
        topics: [stream],
      };

      this.socket.send(JSON.stringify(unsubscription));

      unsubscribe();
    };
  }
}

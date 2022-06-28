/* eslint-disable id-blacklist */
import { injectable } from 'inversify';

// eslint-disable-next-line import/no-internal-modules
import { Exchange } from '../../../models/Exchange';
import { IDeal, IInstrument, IOrderBook } from '../models';

@injectable()
export abstract class ConnectorBase {
  public abstract readonly exchange: Exchange;
  public abstract readonly isReady: boolean;

  public abstract loadInstruments(): Promise<IInstrument[]>;

  public abstract subscribeOrderBook(name: string, cb: (data: IOrderBook) => void): () => void;

  public abstract subscribeTradesStream(name: string, cb: (data: IDeal) => void): () => void;

  public abstract getRecentTrades(inst: string): Promise<IDeal[]>;
}

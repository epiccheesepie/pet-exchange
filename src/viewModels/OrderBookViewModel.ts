/* eslint-disable no-void */

import { injectable, multiInject } from 'inversify';
import { action, computed, makeObservable, observable, reaction } from 'mobx';

// eslint-disable-next-line import/no-internal-modules
import { ConnectorBase, IOrderBook, IOrderBookEntry } from '../connectors/abstractions';
import { AppStore, InstrumentsStore } from '../stores';

@injectable()
export class OrderBookViewModel {
  @observable
  private _orderBook: IOrderBook | undefined;

  private unsubscribe: (() => void) | undefined = undefined;

  public constructor(
    private readonly appStore: AppStore,
    private readonly instrumentsStore: InstrumentsStore,
    @multiInject(ConnectorBase) public readonly connectors: ConnectorBase[],
  ) {
    makeObservable(this);

    reaction(
      () => [this.instrumentsStore.currentInstrument, this.appStore.connector.isReady],
      () => this.subscribeOrderBook(),
    );

    this.subscribeOrderBook();
  }

  private subscribeOrderBook(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    if (!this.instrumentsStore.currentInstrument || !this.appStore.connector.isReady) {
      return;
    }

    this.unsubscribe = this.appStore.connector.subscribeOrderBook(
      this.instrumentsStore.currentInstrument.name,
      (data: IOrderBook) => {
        this.setOrderBook(data);
      },
    );
  }

  @computed
  public get asks(): IOrderBookEntry[] {
    return this.orderBook.asks.slice().reverse();
  }

  @computed
  public get bids(): IOrderBookEntry[] {
    return this.orderBook.bids;
  }

  @computed
  private get orderBook(): IOrderBook {
    return this?._orderBook ?? { asks: [], bids: [] };
  }

  @action
  public setOrderBook(data: IOrderBook): void {
    this._orderBook = data;
  }
}

/* eslint-disable no-void */
/* eslint-disable no-return-assign */
import { injectable, multiInject } from 'inversify';
import { action, computed, makeObservable, observable, reaction } from 'mobx';

// eslint-disable-next-line import/no-internal-modules
import { ConnectorBase, IDeal } from '../connectors/abstractions';
import { Deal } from '../models';
import { AppStore, InstrumentsStore } from '../stores';

@injectable()
export class DealsViewModel {
  @observable
  public _dealsData: IDeal[] = [];

  private unsubscribe: (() => void) | undefined = undefined;

  public constructor(
    private readonly instrumentsStore: InstrumentsStore,
    private readonly appStore: AppStore,
    @multiInject(ConnectorBase) public readonly connectors: ConnectorBase[],
  ) {
    makeObservable(this);

    reaction(
      () => [this.instrumentsStore.currentInstrument, this.appStore.connector.isReady],
      () => {
        this.subscribeTradeStream();
        if (this.instrumentsStore.currentInstrument !== undefined && this.appStore.connector.isReady) {
          void connectors[this.appStore.exchange]
            .getRecentTrades(this.instrumentsStore.currentInstrument.name)
            .then(this.setDealsData);
        }
      },
    );

    this.subscribeTradeStream();
  }

  private subscribeTradeStream(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    if (!this.instrumentsStore.currentInstrument || !this.appStore.connector.isReady) {
      return;
    }

    this.unsubscribe = this.appStore.connector.subscribeTradesStream(
      this.instrumentsStore.currentInstrument.name,
      (data: IDeal) => {
        this.addDealData(data);
      },
    );
  }

  @computed
  public get dealsData(): Deal[] {
    return this.mapDeals(this._dealsData).reverse();
  }

  private mapDeals = (res: IDeal[]): Deal[] => {
    let lastPrice = 0;
    return res.map(
      (item: IDeal): Deal => {
        const isGrowing = +item.price > lastPrice;
        lastPrice = +item.price;
        return {
          isGrowing,
          ...item,
        };
      },
    );
  };

  @action
  public setDealsData = (res: IDeal[]): void => {
    this._dealsData = res.sort((a, b) => a.timestamp - b.timestamp).slice(-20);
  };

  @action
  public addDealData = (data: IDeal): void => {
    this._dealsData = this._dealsData.slice(1).concat([data]);
  };
}

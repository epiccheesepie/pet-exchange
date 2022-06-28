import { injectable } from 'inversify';
import { computed } from 'mobx';

import { Exchange, Instrument } from '../models';
import { AppStore, InstrumentsStore } from '../stores';

@injectable()
export class AppViewModel {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly instrumentsStore: InstrumentsStore, private readonly appStore: AppStore) {}

  @computed
  public get instrument(): Instrument | undefined {
    return this.instrumentsStore.currentInstrument;
  }

  @computed
  public get exchange(): Exchange {
    return this.appStore.exchange;
  }

  @computed
  public get isLoading(): boolean {
    return this.instrumentsStore.isLoading;
  }

  public setExchange = (exchange: Exchange) => (): void => {
    this.appStore.setExchange(exchange);
  };
}

import { injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';

import { Instrument } from '../models';
import { InstrumentsStore } from '../stores';

@injectable()
export class InstrumentsViewModel {
  @observable private _filter = '';

  public constructor(private readonly instrumentsStore: InstrumentsStore) {
    makeObservable(this);
  }

  @computed
  public get instruments(): Instrument[] {
    return this.instrumentsStore.instruments;
  }

  @computed
  public get filter(): string {
    return this._filter;
  }

  @computed
  public get filteredInstruments(): Instrument[] {
    const term = this._filter.toLowerCase();
    return this.instruments.filter(({ name }) => name.toLowerCase().replace(/_/g, '').indexOf(term) >= 0);
  }

  @action
  public setFiltered(filter: string): void {
    this._filter = filter;
  }

  @action
  public setCurrentInstrument = (instrument: Instrument) => (): void => {
    this.instrumentsStore.setCurrentInstrument(instrument);
  };
}

import { injectable, multiInject } from 'inversify';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';

// eslint-disable-next-line import/no-internal-modules
import { ConnectorBase } from '../connectors/abstractions';
import { Exchange, Instrument } from '../models';
import { AppStore } from './AppStore';

@injectable()
export class InstrumentsStore {
  @observable
  private _instruments: Map<Exchange, Instrument[]> = new Map<Exchange, Instrument[]>();

  @observable
  private _currentInstrument: Instrument | undefined;

  @observable
  private _isLoading = true;

  public constructor(@multiInject(ConnectorBase) connectors: ConnectorBase[], private readonly appStore: AppStore) {
    makeObservable(this);
    // eslint-disable-next-line no-void
    void Promise.all(
      connectors.map((x) =>
        x.loadInstruments().then((instruments) => ({
          exchange: x.exchange,
          instruments,
        })),
      ),
    ).then((data) => {
      for (const { exchange, instruments } of data) {
        this._instruments.set(
          exchange,
          instruments.map((x) => new Instrument(x)),
        );
      }
      this.setCurrentInstrument(this.instruments[0]);
      runInAction(() => {
        this._isLoading = false;
      });
    });

    reaction(
      (): Exchange => this.appStore.exchange,
      () => {
        if (this.instruments.length) {
          this.setCurrentInstrument(this.instruments[0]);
        }
      },
    );
  }

  @computed
  public get instruments(): Instrument[] {
    const exchange = this.appStore.exchange;
    return this._instruments?.get(exchange) ?? [];
  }

  @computed
  public get currentInstrument(): Instrument | undefined {
    return this._currentInstrument;
  }

  @computed
  public get isLoading(): boolean {
    return this._isLoading;
  }

  @action
  public setCurrentInstrument = (instrument: Instrument): void => {
    this._currentInstrument = instrument;
  };
}

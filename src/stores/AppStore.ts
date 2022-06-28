/* eslint-disable import/no-internal-modules */
import { injectable, multiInject } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';

import { ConnectorBase } from '../connectors/abstractions';
import { Exchange } from '../models';

@injectable()
export class AppStore {
  @observable
  private _exchange: Exchange = Exchange.Binance;

  public constructor(@multiInject(ConnectorBase) public readonly connectors: ConnectorBase[]) {
    makeObservable(this);
  }

  @computed
  public get exchange(): Exchange {
    return this._exchange;
  }

  @computed
  public get connector(): ConnectorBase {
    const connector = this.connectors.find((x) => x.exchange === this.exchange);
    if (!connector) {
      throw new Error('Connector is not selected');
    }

    return connector;
  }

  @action
  public setExchange = (exchange: Exchange): void => {
    this._exchange = exchange;
  };
}

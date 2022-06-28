import { inject, injectable } from 'inversify';

import { AppStore, InstrumentsStore } from './stores';

@injectable()
export class DevTools {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    @inject(AppStore) public readonly appStore: AppStore,
    @inject(InstrumentsStore) public readonly instrumentsStore: InstrumentsStore,
  ) {}
}

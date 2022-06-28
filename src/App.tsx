import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';

import styles from './App.module.scss';
import { Deals, Instruments, OrderBook } from './components';
import { useInject } from './hooks';
import { Exchange } from './models';
import { AppViewModel } from './viewModels';

const exchanges: Record<Exchange, string> = {
  [Exchange.Binance]: 'Binance',
  [Exchange.Exmo]: 'Exmo',
};

export const App: React.FC = observer(() => {
  const appViewModel: AppViewModel = useInject(AppViewModel);

  if (appViewModel.isLoading) {
    return (
      <main>
        <div className={styles.preloader}>
          <span className={styles.preloaderContent} />
        </div>
      </main>
    );
  } else {
    return (
      <main>
        <div className={styles.exchanges}>
          {Object.keys(exchanges)
            .map<Exchange>((x) => (+x as unknown) as Exchange)
            .map((exchange) => (
              <div
                key={exchange}
                className={clsx(styles.exchange, { [styles.activeExchange]: exchange === appViewModel.exchange })}
                onClick={appViewModel.setExchange(exchange)}
              >
                {exchanges[exchange]}
              </div>
            ))}
        </div>
        <div className={styles.content}>
          <Instruments />
          <div className={styles.right}>
            <div className={styles.title}>
              <h1>{appViewModel.instrument?.name}</h1>
            </div>
            <div className={styles.others}>
              <Deals />
              <OrderBook />
            </div>
          </div>
        </div>
      </main>
    );
  }
});

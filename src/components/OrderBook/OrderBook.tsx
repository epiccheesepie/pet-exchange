import { observer } from 'mobx-react';
import React from 'react';

import { useInject } from '../../hooks';
import { OrderBookViewModel } from '../../viewModels';
import styles from './OrderBook.module.scss';

export const OrderBook: React.FC = observer(
  (): React.ReactElement => {
    const orderBookViewModel = useInject(OrderBookViewModel);

    return (
      <div className={styles.orderBook}>
        <h2>Стакан</h2>
        <div className={styles.option}>
          <span>Price</span>
          <span>Amount</span>
        </div>
        <div className={styles.content}>
          <div className={styles.wrap}>
            {orderBookViewModel.asks.map(({ price, quantity }, index) => (
              <div key={String(index)} className={styles.item}>
                <span className={styles.red}>{price}</span>
                <span>{quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.wrap}>
            {orderBookViewModel.bids.map(({ price, quantity }, index) => (
              <div key={String(index)} className={styles.item}>
                <span className={styles.green}>{price}</span>
                <span>{quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

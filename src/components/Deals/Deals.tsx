import { observer } from 'mobx-react';
import React from 'react';

import { useInject } from '../../hooks';
import { Deal } from '../../models';
import { DealsViewModel } from '../../viewModels';
import styles from './Deals.module.scss';

// потом в utils
const toTime = (ts: number): string => {
  const date = new Date(ts);
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
export const Deals: React.FC = observer(() => {
  const dealsViewModel: DealsViewModel = useInject(DealsViewModel);
  const dealsData: Deal[] = dealsViewModel.dealsData;
  return (
    <div className={styles.deals}>
      <h2>Последние сделки</h2>
      <div className={styles.option}>
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>
      <div className={styles.content}>
        <div className={styles.wrap}>
          {dealsData.map(({ price, quantity, isGrowing, timestamp, id }) => {
            return (
              <div className={styles.item} key={(price * 7 + quantity) * 7 + timestamp + id}>
                <span className={isGrowing ? styles.red : styles.green}>{price}</span>
                <span>{quantity}</span>
                <span>{toTime(timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

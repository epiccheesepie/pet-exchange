import { observer } from 'mobx-react';
import React from 'react';

import { useInject } from '../../hooks';
import { Instrument } from '../../models';
import { InstrumentsViewModel } from '../../viewModels';
import styles from './Instruments.module.scss';

export const Instruments: React.FC = observer(() => {
  const instrumentsViewModel = useInject(InstrumentsViewModel);

  const handleChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    const value: string = e.currentTarget.value;
    instrumentsViewModel.setFiltered(value);
  };

  return (
    <div className={styles.instruments}>
      <div className={styles.option}>
        <input
          type='text'
          placeholder='Введите валюту'
          value={instrumentsViewModel.filter}
          onChange={(e) => handleChange(e)}
        />
        <div className={styles.table}>
          <span>Name</span>
          <span>Price</span>
        </div>
      </div>
      <div className={styles.content}>
        {instrumentsViewModel.filteredInstruments.map((instrument: Instrument, index: number) => {
          return (
            <div
              className={styles.item}
              key={String(index)}
              onClick={instrumentsViewModel.setCurrentInstrument(instrument)}
            >
              <div className={styles.name}>
                <span>{instrument.name}</span>
              </div>
              <span className={styles.price}>{instrument.price}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

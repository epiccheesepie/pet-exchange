/* eslint-disable import/no-internal-modules */
import { Module } from '../di';
import { binanceModule } from './binance/module';
import { exmoModule } from './exmo/module';

export const connectorsModule = Module.create('connectorsModule').add(binanceModule).add(exmoModule);

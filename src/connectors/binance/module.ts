/* eslint-disable import/no-internal-modules */
import { Module } from '../../di';
import { ConnectorBase } from '../abstractions';
import { Connector } from './api';

export const binanceModule = Module.create('binanceModule').register((ctx) => ctx.addType(ConnectorBase, Connector));

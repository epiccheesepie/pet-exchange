/* eslint-disable import/no-internal-modules */
import { connectorsModule } from './connectors/module';
import { DevTools } from './DevTools';
import { Module } from './di';
import { AppStore, InstrumentsStore } from './stores';
import { AppViewModel, DealsViewModel, InstrumentsViewModel, OrderBookViewModel } from './viewModels';

export const appModule = Module.create('appModule')
  .add(connectorsModule)
  .register((ctx) =>
    ctx
      .addSelfType(AppStore)
      .addSelfType(AppViewModel)
      .addSelfType(DevTools)
      .addSelfType(InstrumentsStore)
      .addSelfType(OrderBookViewModel)
      .addSelfType(DealsViewModel)
      .addSelfType(InstrumentsViewModel),
  )
  .configure((ctx) => {
    window.devTools = ctx.resolve(DevTools);
  });

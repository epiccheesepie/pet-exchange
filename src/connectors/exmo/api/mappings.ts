import { IDeal, IInstrument, IOrderBook, IOrderBookEntry } from '../../abstractions';
import { Deal, Instrument, OrderBook, Trade } from '../models';

export const mapInstruments = (json: Record<string, Instrument>): IInstrument[] => {
  const instruments: IInstrument[] = [];
  for (const name of Object.getOwnPropertyNames(json)) {
    const instrument = json[name];
    const item: IInstrument = {
      name: name ?? '',
      bidPrice: +instrument?.buy_price ?? 0,
      askPrice: +instrument?.sell_price ?? 0,
    };
    instruments.push(item);
  }
  return instruments;
};

export const mapOrderBook = (json: OrderBook): IOrderBook => {
  const asks: IOrderBookEntry[] = json?.ask.map(([price, quantity]) => ({ price, quantity })) ?? [];
  const bids: IOrderBookEntry[] = json?.bid.map(([price, quantity]) => ({ price, quantity })) ?? [];
  return new IOrderBook(asks, bids);
};

export const mapDeals = (item: Deal): IDeal => {
  return {
    price: +item.price,
    quantity: +item.quantity,
    timestamp: item.date * 1000,
    id: item.trade_id,
  };
};

export const mapTrades = (json: Trade): IDeal => {
  return {
    price: +json.price,
    quantity: +json.quantity,
    timestamp: json.date * 1000,
    id: json.trade_id,
  };
};

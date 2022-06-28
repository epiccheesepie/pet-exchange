import { IDeal, IInstrument, IOrderBook, IOrderBookEntry } from '../../abstractions';
import { Deal, Instrument, OrderBook, Trade } from '../models';

export const mapInstruments = (item: Instrument): IInstrument => {
  return {
    name: item?.symbol ?? '',
    bidPrice: +item?.bidPrice ?? 0,
    askPrice: +item?.askPrice ?? 0,
  };
};

export const mapDeals = (item: Deal): IDeal => {
  return {
    price: +item.price,
    quantity: +item.qty,
    timestamp: item.time,
    id: item.id,
  };
};

export const mapOrderBook = (json: OrderBook): IOrderBook => {
  const asks: IOrderBookEntry[] = json.asks?.map(([price, quantity]) => ({ price, quantity })) ?? [];
  const bids: IOrderBookEntry[] = json.bids?.map(([price, quantity]) => ({ price, quantity })) ?? [];

  return new IOrderBook(asks, bids);
};

export const mapTrades = (json: Trade): IDeal => {
  return {
    price: +json.p,
    quantity: +json.q,
    timestamp: json.T,
    id: json.t,
  };
};

export class IOrderBook {
  public asks: IOrderBookEntry[] = [];
  public bids: IOrderBookEntry[] = [];

  constructor(asks: IOrderBookEntry[], bids: IOrderBookEntry[]) {
    this.asks = asks;
    this.bids = bids;
  }
}

export interface IOrderBookEntry {
  price: string;
  quantity: string;
}

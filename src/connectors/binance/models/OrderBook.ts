export interface OrderBook {
  lastUpdateId: number;
  asks: Array<Array<string>>;
  bids: Array<Array<string>>;
}

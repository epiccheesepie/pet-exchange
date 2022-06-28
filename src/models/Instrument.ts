// eslint-disable-next-line import/no-internal-modules
import { IInstrument } from '../connectors/abstractions/models/IInstrument';

export class Instrument {
  private readonly _name: string;
  private readonly _bidPrice: number;
  private readonly _askPrice: number;

  public constructor(_dto: IInstrument) {
    this._name = _dto.name;
    this._bidPrice = _dto.bidPrice;
    this._askPrice = _dto.askPrice;
  }

  public get price(): string {
    return ((this._bidPrice + this._askPrice) / 2).toFixed(6);
  }

  public get name(): string {
    return this._name;
  }
}

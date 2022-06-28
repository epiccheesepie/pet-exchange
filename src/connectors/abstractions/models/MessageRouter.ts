import { Observable } from '../../../models';

export type Message<TType, TData> = {
  type: TType;
  data: TData;
};

export class MessageRouter<TMessage, TMap extends Record<string, (e: TMessage) => unknown>> {
  private readonly observables = new Map<keyof TMap, Observable<unknown>>();

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly parseMessage: (msg: MessageEvent) => TMessage,
    private readonly resolveMessageType: (msg: TMessage) => keyof TMap,
    private readonly map: TMap,
  ) {}

  public process(e: MessageEvent): void {
    const msg = this.parseMessage(e);
    const type = this.resolveMessageType(msg);
    const result = this.map[type](msg) as ReturnType<TMap[typeof type]>;
    const observable = this.observables.get(type) as Observable<ReturnType<TMap[typeof type]>>;
    if (observable && observable.hasSubscribers) {
      observable.notify(result);
    }
  }

  public subscribe<TKey extends keyof TMap>(type: TKey, callback: (e: ReturnType<TMap[TKey]>) => void): () => void {
    const observable =
      (this.observables.get(type) as Observable<ReturnType<TMap[TKey]>>) ?? new Observable<ReturnType<TMap[TKey]>>();
    if (!this.observables.has(type)) {
      this.observables.set(type, observable as Observable<unknown>);
    }

    return observable.subscribe(callback);
  }
}

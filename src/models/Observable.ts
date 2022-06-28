import { action, computed, makeObservable, observable } from 'mobx';

export type SubscriptionCallback<TEvent> = (message: TEvent) => void;

export class Observable<TEvent> {
  @observable.shallow
  private readonly subscribers: Array<SubscriptionCallback<TEvent>> = [];

  public constructor() {
    makeObservable(this);
  }

  @computed
  public get hasSubscribers(): boolean {
    return this.subscribers.length > 0;
  }

  @action
  public subscribe(callback: SubscriptionCallback<TEvent>): () => void {
    this.subscribers.push(callback);

    return (): void => {
      const index = this.subscribers.findIndex((x) => x === callback);
      this.subscribers.splice(index, 1);
    };
  }

  @action
  public notify(event: TEvent): void {
    this.subscribers.slice().forEach((handle) => {
      handle(event);
    });
  }
}

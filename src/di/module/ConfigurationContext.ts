import { Container, interfaces } from 'inversify';

export type ConfigurationAction = (ctx: ConfigurationContext) => void;

export class ConfigurationContext {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly _container: Container) {}

  // resolve given type from container
  public resolve<TDependency>(id: interfaces.ServiceIdentifier<TDependency>): TDependency {
    return this._container.get<TDependency>(id);
  }
}

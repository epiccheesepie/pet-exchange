import { Container } from 'inversify';

import { ConfigurationAction, ConfigurationContext } from './ConfigurationContext';
import { RegistrationAction, RegistrationContext } from './RegistrationContext';

export class Module {
  public name?: string;

  public static create(name?: string): Module {
    return new Module(name);
  }

  private readonly _modules: Module[] = [];
  private readonly _registrations: RegistrationAction[] = [];
  private readonly _configurations: ConfigurationAction[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(name?: string) {
    this.name = name;
  }

  // Add inner module
  public add(module: Module): Module {
    this._modules.push(module);

    return this;
  }

  // Add registration function
  public register(register: RegistrationAction): Module {
    this._registrations.push(register);

    return this;
  }

  // Add configuration function
  public configure(configure: ConfigurationAction): Module {
    this._configurations.push(configure);

    return this;
  }

  // Init module with given container
  public init(container: Container): void {
    this.runRegistration(new RegistrationContext(container));
    this.runConfiguration(new ConfigurationContext(container));
  }

  private runRegistration(ctx: RegistrationContext): void {
    this._modules.forEach((module) => module.runRegistration(ctx));
    this._registrations.forEach((register) => register(ctx));
  }

  private runConfiguration(ctx: ConfigurationContext): void {
    this._modules.forEach((module) => module.runConfiguration(ctx));
    this._configurations.forEach((configure) => configure(ctx));
  }
}

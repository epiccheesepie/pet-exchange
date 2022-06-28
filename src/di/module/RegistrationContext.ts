import { Container, interfaces } from 'inversify';

import { isDefined } from '../../utils';
import { DependencyClass } from './DependencyClass';
import { Scope } from './Scope';

export type RegistrationAction = (ctx: RegistrationContext) => void;

export class RegistrationContext {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly _container: Container) {}

  // register constant value of given type
  public addConstant<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: TDependency,
  ): RegistrationContext {
    this._container.bind<TDependency>(service).toConstantValue(implementation);

    return this;
  }

  public addSelfTypeRequested<TDependency>(
    implementation: DependencyClass<TDependency>,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addSelfType(implementation, Scope.REQUEST, name);
  }

  public addSelfTypeSingleton<TDependency>(
    implementation: DependencyClass<TDependency>,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addSelfType(implementation, Scope.SINGLETON, name);
  }

  public addSelfTypeTransient<TDependency>(
    implementation: DependencyClass<TDependency>,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addSelfType(implementation, Scope.TRANSIENT, name);
  }

  // register given type as self implementation
  public addSelfType<TDependency>(
    implementation: DependencyClass<TDependency>,
    scope: Scope = Scope.SINGLETON,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addType(implementation, implementation, scope, name);
  }

  public addTypeRequested<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: DependencyClass<TDependency>,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addType(service, implementation, Scope.REQUEST, name);
  }

  public addTypeSingeton<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: DependencyClass<TDependency>,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addType(service, implementation, Scope.SINGLETON, name);
  }

  public addTypeTransient<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: DependencyClass<TDependency>,
    name?: string | undefined,
  ): RegistrationContext {
    return this.addType(service, implementation, Scope.TRANSIENT, name);
  }

  // register given type as given implementation
  public addType<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: DependencyClass<TDependency>,
    scope: Scope = Scope.SINGLETON,
    name?: string | undefined,
  ): RegistrationContext {
    if (isDefined(name)) {
      const binding = this._container.bind<TDependency>(service).to(implementation);
      binding.whenTargetNamed(name);
      return this.toScope(binding, scope);
    } else {
      const binding = this._container.bind<TDependency>(service).to(implementation);
      return this.toScope(binding, scope);
    }
  }

  // register given type as given implementation
  public addTypeFactory<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: (ctx: interfaces.Context) => TDependency,
  ): RegistrationContext {
    const binding = this._container
      .bind<TDependency>(service)
      .toDynamicValue(implementation as (ctx: interfaces.Context) => TDependency);

    return this.toScope(binding, Scope.SINGLETON);
  }

  private toScope<TDependency>(
    binding: interfaces.BindingInWhenOnSyntax<TDependency>,
    scope: Scope,
  ): RegistrationContext {
    switch (scope) {
      case Scope.SINGLETON:
        binding.inSingletonScope();
        break;
      case Scope.REQUEST:
        binding.inRequestScope();
        break;
      case Scope.TRANSIENT:
        binding.inTransientScope();
        break;
      default:
    }

    return this;
  }
}

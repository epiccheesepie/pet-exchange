### DI Modules

#### Зачем

Старый вариант регистрации зависимостей через функции - не удобен, потому что:

- регистрация зависимостей в контейнере, их настройка и разрешение - в одном месте
- из-за этого нужен детерминированный порядок вызовов регистраций и разрешения - это не работает с таким количеством модулей

#### Решение

Вся регистрация зависимостей в DI - через модули.
Модули представляют из себя иерархическую структуру:

= root

== module A

== module B
и так далее.

Интерфейсы в общих чертах:

```typescript
export class Module {
  // Add inner module
  public add(module: Module): Module;
  // Add registration function
  public register(register: RegistrationAction);
  // Add configuration function
  public configure(configure: ConfigurationAction);
  // Init module with given container
  public init(container: Container);
}

export type RegistrationAction = (ctx: RegistrationContext) => void;
export class RegistrationContext {
  public constructor(private readonly _container: Container) {}

  // register constant value of given type
  public addConstant<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: TDependency,
  ): RegistrationContext;

  // register given type as self implementation
  public addSelfType<TDependency>(
    implementation: DependencyClass<TDependency> | ((ctx: interfaces.Context) => TDependency),
    scope: Scope = Scope.SINGLETON,
  ): RegistrationContext;

  // register given type as given implementation
  public addType<TDependency>(
    service: interfaces.ServiceIdentifier<TDependency>,
    implementation: DependencyClass<TDependency> | ((ctx: interfaces.Context) => TDependency),
    scope: Scope = Scope.SINGLETON,
  ): RegistrationContext;
}

export type ConfigurationAction = (ctx: ConfigurationContext) => void;
export class ConfigurationContext {
  public constructor(private readonly _container: Container) {}
  // resolve given type from container
  public resolve<TDependency>(id: interfaces.ServiceIdentifier<TDependency>): TDependency;
}
```

Как это работает:

- вызов root module.init(container)
- последовательный вызов всех RegistrationAction у всех зарегистрированных модулей
- последовательный вызов ConfigurationAction у всех зарегистрированных модулей
  Тем самым, этапы регистрации и конфигурации зависимостей разделены и не пересекаются

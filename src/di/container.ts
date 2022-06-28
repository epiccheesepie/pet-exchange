import { BindingScopeEnum, Container } from 'inversify';

export const container = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});

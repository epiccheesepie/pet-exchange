import { Container, interfaces } from 'inversify';

import { container } from '../container';

export type ExtractDependency = <TDependency>(
  dependencyId: interfaces.ServiceIdentifier<TDependency>,
  name?: string | number | symbol,
) => TDependency;

export const createExtractDependency = <TDependency>(container: Container) => (
  dependencyId: interfaces.ServiceIdentifier<TDependency>,
  name?: string | number | symbol,
): TDependency => {
  if (name) {
    return container.getNamed<TDependency>(dependencyId, name);
  }
  return container.get<TDependency>(dependencyId);
};

//

export const extractDependency: ExtractDependency = createExtractDependency(container);

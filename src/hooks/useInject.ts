import { interfaces } from 'inversify';
import { useMemo } from 'react';

import { extractDependency } from '../di';

export function useInject<TDependency>(dependencyId: interfaces.ServiceIdentifier<TDependency>): TDependency {
  const dependency = useMemo(() => extractDependency(dependencyId), [dependencyId]);

  return dependency;
}

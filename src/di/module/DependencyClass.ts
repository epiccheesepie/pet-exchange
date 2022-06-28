/* eslint-disable @typescript-eslint/no-explicit-any */
export type DependencyClass<TDependency> = new (...args: any[]) => TDependency;

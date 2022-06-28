import { DevTools } from './DevTools';

declare global {
  interface Window {
    devTools: DevTools;
  }
}

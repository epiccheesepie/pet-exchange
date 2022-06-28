// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />

// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
// eslint-disable-next-line import/no-unresolved,import/no-unassigned-import
import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';
// eslint-disable-next-line import/no-internal-modules
import { container } from './di/container';
import { appModule } from './module';

appModule.init(container);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

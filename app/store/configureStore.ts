import {History} from 'history';
import {Store} from 'react-redux';

import {GlobalState} from 'reducers';

interface MyStore {
  configureStore: () => Store<GlobalState>,
  history: History
}

let store: MyStore;

if (process.env.NODE_ENV === 'production') {
  store = require('./configureStore.prod'); // eslint-disable-line global-require
} else {
  store = require('./configureStore.dev'); // eslint-disable-line global-require
}
export const configureStore = store.configureStore;
export const history = store.history;

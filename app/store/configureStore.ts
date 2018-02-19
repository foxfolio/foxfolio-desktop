import { History } from 'history';
import { Store } from 'react-redux';

import { GlobalState } from '../reducers';

interface MyStore {
  configureStore: () => Store<GlobalState>;
  history: History;
}

let store: MyStore;

store =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.prod') // tslint:disable-line:no-var-requires
    : require('./configureStore.dev'); // tslint:disable-line:no-var-requires

export const configureStore = store.configureStore;
export const history = store.history;

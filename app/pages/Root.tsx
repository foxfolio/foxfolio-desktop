import { History } from 'history';
import React from 'react';
import { Provider, Store } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';
import { GlobalState } from '../reducers';
import { Routes } from '../routes';

interface RootProps {
  store: Store<GlobalState>;
  history: History;
  persistor: Persistor;
}

export default function Root({ store, history, persistor }: RootProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <Routes getState={store.getState} />
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
}

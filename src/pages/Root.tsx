import { History } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';
import { Routes } from '../routes';
import { Store } from '../store/configureStore';

interface RootProps {
  store: Store;
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

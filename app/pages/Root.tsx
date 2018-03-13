import { History } from 'history';
import React from 'react';
import { Provider, Store } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { GlobalState } from '../reducers';
import { Routes } from '../routes';

interface RootProps {
  store: Store<GlobalState>;
  history: History;
}

export default function Root({ store, history }: RootProps) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes getState={store.getState} />
      </ConnectedRouter>
    </Provider>
  );
}

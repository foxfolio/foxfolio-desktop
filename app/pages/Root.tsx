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

// TODO Fix hot reloading (The random key removes local state)
export default function Root({ store, history }: RootProps) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history} key={Math.random()}>
        <Routes getState={store.getState} />
      </ConnectedRouter>
    </Provider>
  );
}

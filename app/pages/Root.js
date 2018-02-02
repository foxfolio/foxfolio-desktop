// @flow
import type { Node } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Routes } from '../routes';

type RootType = {
  store: Store<*, *, Dispatch>,
  history: Object
};

// TODO Fix hot reloading (The random key removes local state)
export default function Root({ store, history }: RootType): Node {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history} key={Math.random()}>
        <Routes getState={store.getState}/>
      </ConnectedRouter>
    </Provider>
  );
}

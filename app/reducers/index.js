// @flow
import { createTransform, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist';
import * as R from 'ramda';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';
import transactions from './transactions';
import sources from './sources';
import wallets from './wallets';
import ticker from './ticker';
import timer from './timer';
import coinlist from './coinlist';
import settings from './settings';

// $FlowFixMe
const mapPath = R.curry((path, f, obj) => R.assocPath(path, f(R.path(path, obj)), obj));

const convertDate = R.map(mapPath(['date'], dateString => new Date(dateString)));
const convertDateIn = key => R.map(mapPath([key], convertDate));

const dateTransform = createTransform(null, (outboundState, key) => {
  if (key === 'transactions' && Object.keys(outboundState).length > 0) {
    return R.pipe(convertDateIn('transfers'), convertDateIn('trades'))(outboundState);
  }
  return outboundState;
});

const config: PersistConfig = {
  key: 'primary',
  blacklist: ['router', 'timer'],
  transforms: [dateTransform],
  storage,
};

const rootReducer = persistCombineReducers(config, {
  coinlist,
  form,
  router,
  settings,
  sources,
  ticker,
  timer,
  transactions,
  wallets,
});

export default rootReducer;

// @flow
import { persistCombineReducers } from 'redux-persist';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';

import { configureReduxPersist } from '../store/configureReduxPersist';

import { exchanges } from './exchanges';
import { wallets } from './wallets';
import { ticker } from './ticker';
import type { Timer } from './timer';
import timer from './timer';
import { coinlist } from './coinlist';
import type { SettingsType } from './settings';
import settings from './settings';
import type { Exchanges } from './exchanges/types.d';
import type { TickerAndHistory } from './ticker/types.d';
import type { Coinlist } from './coinlist/types.d';
import type { Wallet } from './wallets/types.d';

const config = configureReduxPersist();
export default persistCombineReducers(config, {
  coinlist,
  exchanges,
  form,
  router,
  settings,
  ticker,
  timer,
  wallets,
});

export type GlobalState = {
  coinlist: Coinlist,
  exchanges: Exchanges,
  settings: SettingsType,
  ticker: TickerAndHistory,
  timer: Timer,
  wallets: Wallet[]
};

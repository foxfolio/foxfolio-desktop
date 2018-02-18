import { persistCombineReducers } from 'redux-persist';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';

import { configureReduxPersist } from '../store/configureReduxPersist';

import { coinlist, Coinlist } from './coinlist';
import { exchanges } from './exchanges';
import { Wallet, wallets } from './wallets';
import { ticker, TickerAndHistory } from './ticker';
import timer, { Timer } from './timer';
import settings, { SettingsType } from './settings';
import { Exchanges } from './exchangeTypes';

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

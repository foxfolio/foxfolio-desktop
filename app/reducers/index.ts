import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { persistCombineReducers } from 'redux-persist';
import { configureReduxPersist } from '../store/configureReduxPersist';
import { coinlist, Coinlist } from './coinlist';
import { exchanges } from './exchanges';
import { Exchanges } from './exchanges.types';
import settings, { SettingsType } from './settings';
import { ticker, TickerAndHistory } from './ticker';
import timers, { Timers } from './timer';
import { Wallet, wallets } from './wallets';

const config = configureReduxPersist();
export default persistCombineReducers(config, {
  coinlist,
  exchanges,
  form,
  router,
  settings,
  ticker,
  timers,
  wallets,
});

export interface GlobalState {
  coinlist: Coinlist;
  exchanges: Exchanges;
  settings: SettingsType;
  ticker: TickerAndHistory;
  timers: Timers;
  wallets: Wallet[];
}

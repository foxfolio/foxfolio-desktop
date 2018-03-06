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
import { trades, TradesMap } from './trades';
import { wallets } from './wallets';
import { Wallet } from './wallets.types';

const config = configureReduxPersist();
export default persistCombineReducers(config, {
  coinlist,
  exchanges,
  form,
  router,
  settings,
  ticker,
  timers,
  trades,
  wallets,
} as any);

export interface GlobalState {
  coinlist: Coinlist;
  exchanges: Exchanges;
  settings: SettingsType;
  ticker: TickerAndHistory;
  timers: Timers;
  trades: TradesMap;
  wallets: Wallet[];
}

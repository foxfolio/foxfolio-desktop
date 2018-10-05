import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { persistCombineReducers } from 'redux-persist';
import { configureReduxPersist } from '../store/configureReduxPersist';
import coinlist from './coinlist';
import { Coinlist } from './coinlist.types';
import exchanges from './exchanges';
import { Exchanges } from './exchanges.types';
import history from './history';
import { History } from './history.types';
import prices from './prices';
import { Prices } from './prices.types';
import settings from './settings';
import { SettingsType } from './settings.types';
import ticker from './ticker';
import { Ticker } from './ticker.types';
import timers from './timer';
import { Timers } from './timer.types';
import trades from './trades';
import { TradesMap } from './trades.types';
import wallets from './wallets';
import { Wallet } from './wallets.types';

const config = configureReduxPersist();
export const rootReducer = persistCombineReducers(config, {
  coinlist,
  exchanges,
  form,
  history,
  router,
  prices,
  settings,
  ticker,
  timers,
  trades,
  wallets,
} as any);

export interface GlobalState {
  coinlist: Coinlist;
  exchanges: Exchanges;
  history: History;
  prices: Prices;
  settings: SettingsType;
  ticker: Ticker;
  timers: Timers;
  trades: TradesMap;
  wallets: Wallet[];
}

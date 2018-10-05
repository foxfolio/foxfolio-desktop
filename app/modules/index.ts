import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { persistCombineReducers } from 'redux-persist';
import { configureReduxPersist } from '../store/configureReduxPersist';
import { coinlist} from './coinlist';
import { Coinlist } from './coinlist.types';
import { exchanges } from './exchanges';
import { Exchanges } from './exchanges.types';
import settings from './settings';
import { SettingsType } from './settings.types';
import ticker from './ticker';
import { TickerAndHistory } from './ticker.types';
import timers, { Timers } from './timer';
import { trades} from './trades';
import { TradesMap } from './trades.types';
import { wallets } from './wallets';
import { Wallet } from './wallets.types';

const config = configureReduxPersist();
export const rootReducer = persistCombineReducers(config, {
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

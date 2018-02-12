import {persistCombineReducers} from 'redux-persist';
import {reducer as form} from 'redux-form';
import {routerReducer as router} from 'react-router-redux';

import {configureReduxPersist} from '../store/configureReduxPersist';

import {exchanges} from './exchanges';
import {wallets} from './wallets';
import {ticker} from './ticker';
import timer, {Timer} from './timer';
import {coinlist} from './coinlist';
import settings, {SettingsType} from './settings';
import {Exchanges} from './exchanges/types.d';
import {TickerAndHistory} from './ticker/types.d';
import {Coinlist} from './coinlist/types.d';
import {Wallet} from './wallets/types.d';

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

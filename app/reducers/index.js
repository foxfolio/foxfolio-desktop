// @flow
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';
import transactions from './transactions';
import sources from './sources';
import wallets from './wallets';
import ticker from './ticker';
import timer from './timer';
import coinlist from './coinlist';
import settings from './settings';

const rootReducer = combineReducers({
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

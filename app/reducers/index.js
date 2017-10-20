// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import transactions from './transactions';
import sources from './sources';
import ticker from './ticker';
import timer from './timer';
import coinlist from './coinlist';

const rootReducer = combineReducers({
  sources,
  timer,
  coinlist,
  transactions,
  router,
  ticker,
});

export default rootReducer;

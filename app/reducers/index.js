// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import transactions from './transactions';
import sources from './sources';
import ticker from './ticker';

const rootReducer = combineReducers({
  sources,
  transactions,
  router,
  ticker,
});

export default rootReducer;

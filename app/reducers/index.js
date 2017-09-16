// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import transactions from './transactions';
import sources from './sources';

const rootReducer = combineReducers({
  sources,
  transactions,
  counter,
  router,
});

export default rootReducer;

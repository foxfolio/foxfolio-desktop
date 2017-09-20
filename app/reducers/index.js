// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import transactions from './transactions';
import sources from './sources';

const rootReducer = combineReducers({
  sources,
  transactions,
  router,
});

export default rootReducer;

// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import bittrex from './bittrex';
import counter from './counter';

const rootReducer = combineReducers({
  transactions: bittrex,
  counter,
  router,
});

export default rootReducer;

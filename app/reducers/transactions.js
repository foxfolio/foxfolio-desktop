// @flow
import { combineReducers } from 'redux';
import bittrex from './bittrex';

const transactionReducer = combineReducers({
  bittrex,
});

export default transactionReducer;

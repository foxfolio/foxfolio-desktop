// @flow
import { getBittrexTransactions, readBittrexTransactionsFromFile } from './exchanges/bittrex';
import getBitstampTransactions from './exchanges/bitstamp';
import type { Trade, Transfer } from '../reducers/transactions';
import type { Action, Dispatch, GetState } from './types';
import type { sourceType } from '../reducers/sources';
import startTimer from './timer';

const REFRESH_TIME_IN_MS = 30000;

function requestTransactions(source): Action {
  return {
    type: 'REQUEST_TRANSACTIONS',
    source,
  };
}

export function receiveTransactions(exchange: string, trades: Trade[] = [], transfers: Transfer[] = []): Action {
  return {
    type: 'RECEIVE_TRANSACTIONS',
    exchange,
    trades,
    transfers,
  };
}

export function failedTransaction(exchange: string, error: string): Action {
  return {
    type: 'FAILED_TRANSACTION',
    exchange,
    error,
  };
}

function getConfiguredSources(state) {
  return state.sources;
}

function fetchTransactions(source) {
  return dispatch => {
    dispatch(requestTransactions(source));
    switch (source.name) {
      case 'bittrex':
        return dispatch(getBittrexTransactions(source));
      case 'bitstamp':
        return dispatch(getBitstampTransactions(source));
      default:
        return dispatch(receiveTransactions(source));
    }
  };
}

export function fetchAllTransactions() {
  return (dispatch: Dispatch, getState: GetState) => {
    const sources = getConfiguredSources(getState());
    return sources.map(source => dispatch(fetchTransactions(source)));
  };
}

export function continuouslyFetchTransactions() {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timer.transactions) {
      const timer = setInterval(() => dispatch(fetchAllTransactions()), REFRESH_TIME_IN_MS);
      dispatch(startTimer('transactions', timer));
    }
  };
}

export function readTransactionsFromFile(source: sourceType) {
  return (dispatch: Dispatch) => {
    switch (source.name) {
      case 'bittrex':
        return dispatch(readBittrexTransactionsFromFile(source));
      default:
        return dispatch(receiveTransactions(source.name));
    }
  };
}

// @flow
import { getBittrexTransactions, readBittrexTransactionsFromFile } from './exchanges/bittrex';
import getBitstampTransactions from './exchanges/bitstamp';
import { getKrakenTransactions } from './exchanges/kraken';
import type { Trade, Transfer } from './transaction.d';
import type { Action, Dispatch, GetState } from './action.d';
import type { Exchange } from './exchange.d';
import startTimer from './timer';

const REFRESH_TIME_IN_MS = 30000;

function requestTransactions(exchange): Action {
  return {
    type: 'REQUEST_TRANSACTIONS',
    source: exchange,
  };
}

export function receiveTransactions(exchange: Exchange, trades: Trade[] = [], transfers: Transfer[] = []): Action {
  return {
    type: 'RECEIVE_TRANSACTIONS',
    exchange,
    trades,
    transfers,
  };
}

export function receiveTransfers(exchange: Exchange, transfers: Transfer[] = []): Action {
  return {
    type: 'RECEIVE_TRANSFERS',
    exchange,
    transfers,
  };
}

export function receiveTrades(exchange: Exchange, trades: Trade[] = []): Action {
  return {
    type: 'RECEIVE_TRADES',
    exchange,
    trades,
  };
}

export function failedTransaction(exchange: Exchange, error: string): Action {
  return {
    type: 'FAILED_REQUEST',
    exchange,
    error,
  };
}

function getConfiguredExchanges(state) {
  return state.sources;
}

function fetchTransactions(exchange: Exchange) {
  return dispatch => {
    dispatch(requestTransactions(exchange));
    switch (exchange.type) {
      case 'bittrex':
        return dispatch(getBittrexTransactions(exchange));
      case 'bitstamp':
        return dispatch(getBitstampTransactions(exchange));
      case 'kraken':
        return dispatch(getKrakenTransactions(exchange));
      default:
        return dispatch(receiveTransactions(exchange));
    }
  };
}

export function fetchAllTransactions() {
  return (dispatch: Dispatch, getState: GetState) => {
    const sources = getConfiguredExchanges(getState());
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

export function readTransactionsFromFile(exchange: Exchange) {
  return (dispatch: Dispatch) => {
    switch (exchange.type) {
      case 'bittrex':
        return dispatch(readBittrexTransactionsFromFile(exchange));
      default:
        return dispatch(receiveTransactions(exchange));
    }
  };
}

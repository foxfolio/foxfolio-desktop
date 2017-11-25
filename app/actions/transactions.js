// @flow
import { getBittrexTransactions, readBittrexTransactionsFromFile } from './exchanges/bittrex';
import getBitstampTransactions from './exchanges/bitstamp';
import { getKrakenTransactions } from './exchanges/kraken';
import type { Trade, Transfer } from './transaction.d';
import type { Action, Dispatch, GetState, ThunkAction } from './action.d';
import type { Exchange } from './exchange.d';
import startTimer from './timer';
import { getBinanceTransactions } from './exchanges/binance';

const REFRESH_TIME_IN_MS = 30000;

function fetchingTransactions(): Action {
  return {
    type: 'LAST_UPDATED',
    key: 'transactions',
    time: new Date(),
  };
}

function requestTransactions(exchange: Exchange): Action {
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
    type: 'FAILED_TRANSACTION_REQUEST',
    exchange,
    error,
  };
}

function getConfiguredExchanges(state) {
  return state.sources;
}

function fetchTransactions(exchange: Exchange): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTransactions(exchange));
    switch (exchange.type) {
      case 'bittrex':
        return dispatch(getBittrexTransactions(exchange));
      case 'bitstamp':
        return dispatch(getBitstampTransactions(exchange));
      case 'kraken':
        return dispatch(getKrakenTransactions(exchange));
      case 'binance':
        return dispatch(getBinanceTransactions(exchange));
      default:
        return dispatch(receiveTransactions(exchange));
    }
  };
}

export function fetchAllTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const sources = getConfiguredExchanges(getState());
    dispatch(fetchingTransactions());
    return sources.map(source => dispatch(fetchTransactions(source)));
  };
}

export function continuouslyFetchTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timer.transactions) {
      const timer = setInterval(() => dispatch(fetchAllTransactions()), REFRESH_TIME_IN_MS);
      dispatch(startTimer('transactions', timer));
    }
  };
}

export function readTransactionsFromFile(exchange: Exchange): ThunkAction {
  return (dispatch: Dispatch) => {
    switch (exchange.type) {
      case 'bittrex':
        return dispatch(readBittrexTransactionsFromFile(exchange));
      default:
        return dispatch(receiveTransactions(exchange));
    }
  };
}

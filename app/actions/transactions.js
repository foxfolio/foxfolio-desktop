// @flow
import { getBittrexBalances, getBittrexTransactions, readBittrexTransactionsFromFile } from './exchanges/bittrex';
import getBitstampTransactions, { getBitstampBalances } from './exchanges/bitstamp';
import { getKrakenBalances, getKrakenTransactions } from './exchanges/kraken';
import type { Trade, Transfer } from './transaction.d';
import type { Action, Dispatch, GetState, ThunkAction } from './action.d';
import type { Exchange } from './exchange.d';
import startTimer from './timer';
import { getBinanceBalances, getBinanceTransactions } from './exchanges/binance';
import type { Balances } from '../types/portfolio.d.ts';

const BALANCE_REFRESH_MS = 30000;
const TRANSACTION_REFRESH_MS = BALANCE_REFRESH_MS * 4;

function setLastUpdate(): Action {
  return {
    type: 'LAST_UPDATED',
    key: 'transactions',
    time: new Date(),
  };
}

function requestBalances(exchange: Exchange): Action {
  return {
    type: 'REQUEST_BALANCES',
    source: exchange,
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

export function receiveBalances(exchange: Exchange, balances: Balances = {}): Action {
  return {
    type: 'RECEIVE_BALANCES',
    exchange,
    balances,
  };
}

export function failedBalances(exchange: Exchange, error: string): Action {
  return {
    type: 'FAILED_BALANCES',
    exchange,
    error,
  };
}

export function failedTransaction(exchange: Exchange, error: string): Action {
  return {
    type: 'FAILED_TRANSACTIONS',
    exchange,
    error,
  };
}

function getConfiguredExchanges(state) {
  return state.sources;
}

function fetchBalances(exchange: Exchange): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestBalances(exchange));
    switch (exchange.type) {
      case 'binance':
        return dispatch(getBinanceBalances(exchange));
      case 'bittrex':
        return dispatch(getBittrexBalances(exchange));
      case 'bitstamp':
        return dispatch(getBitstampBalances(exchange));
      case 'kraken':
        return dispatch(getKrakenBalances(exchange));
      default:
        return dispatch(receiveBalances(exchange));
    }
  };
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

export function fetchAllBalances(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const sources = getConfiguredExchanges(getState());
    dispatch(setLastUpdate());
    sources.forEach(source => dispatch(fetchBalances(source)));
  };
}

export function fetchAllTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const sources = getConfiguredExchanges(getState());
    sources.forEach(source => dispatch(fetchTransactions(source)));
  };
}

export function continuouslyFetchTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timer.transactions) {
      const balanceTimer = setInterval(() => dispatch(fetchAllBalances()), BALANCE_REFRESH_MS);
      const transactionTimer = setInterval(() => dispatch(fetchAllTransactions()), TRANSACTION_REFRESH_MS);
      dispatch(startTimer('balances', balanceTimer));
      dispatch(startTimer('transactions', transactionTimer));
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

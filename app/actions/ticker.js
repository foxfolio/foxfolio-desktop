// @flow
import * as R from 'ramda';
import type { Action, Dispatch, GetState, ThunkAction } from './types';
import type { Transaction } from '../reducers/transactions';
import startTimer from './timer';

const REFRESH_TIME_IN_MS = 10000;

function receiveTickerUpdate(ticker: Object): Action {
  return {
    type: 'TICKER_UPDATE',
    ticker,
  };
}

function receiveCoinList(coinlist: Object): Action {
  return {
    type: 'RECEIVE_COIN_LIST',
    coinlist,
  };
}

export function requestTickerUpdate(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const symbols = getSymbolsFromTransactions(state.transactions);
    fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.from.join(',')}
        &tsyms=${symbols.to.join(',')}`)
      .then(result => result.json())
      .then(result => dispatch(receiveTickerUpdate(result.RAW)))
      .catch(error => console.error(error));
  };
}

export function requestCoinList(): ThunkAction {
  return (dispatch: Dispatch) => {
    fetch('https://www.cryptocompare.com/api/data/coinlist')
      .then(result => result.json())
      .then(result => dispatch(receiveCoinList(result.Data)))
      .catch(error => console.error(error));
  };
}

export function continuouslyUpdateTicker() {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timer.ticker) {
      const timer = setInterval(() => dispatch(requestTickerUpdate()), REFRESH_TIME_IN_MS);
      dispatch(startTimer('ticker', timer));
    }
  };
}

function getSymbolsFromTransactions(transactions): { from: string[], to: string[] } {
  const trans: Transaction[] = R.chain(source => R.concat(source.trades, source.transfers), R.values(transactions));
  const symbols = R.reduce((acc, transaction) => {
    if (transaction.type === 'BUY' || transaction.type === 'SELL') {
      acc.from.push(transaction.market.minor);
      acc.to.push(transaction.market.major);
    } else if (transaction.type === 'DEPOSIT' || transaction.type === 'WITHDRAW') {
      acc.to.push(transaction.currency);
      acc.from.push(transaction.currency);
    }
    return acc;
  }, { from: [], to: [] }, trans);
  return R.map(R.uniq)(symbols);
}

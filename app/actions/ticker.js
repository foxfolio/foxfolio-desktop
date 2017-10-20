// @flow
import * as R from 'ramda';
import type { Action, Dispatch, GetState, ThunkAction } from './types';
import type { Transaction } from '../reducers/transactions';

const REFRESH_TIME_IN_MS = 10000;

function receiveTickerUpdate(ticker: Object): Action {
  return {
    type: 'TICKER_UPDATE',
    ticker,
  };
}

export function requestTickerUpdate(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const symbols = getSymbolsFromTransactions(state.transactions);
    Promise.all(
      symbols.map(symbol =>
        fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=BTC,USD,EUR`)
          .then(result => result.json())
          .then(result => ({ [symbol]: result }))))
      .then(result => R.mergeAll(result))
      .then(result => dispatch(receiveTickerUpdate(result)))
      .catch(error => console.error(error));

    // .then(result => dispatch(receiveTickerUpdate(result)))
    // .catch(error => console.error(error));
  };
}

export function continuouslyUpdateTicker() {
  return (dispatch: Dispatch) => {
    setInterval(() => dispatch(requestTickerUpdate()), REFRESH_TIME_IN_MS);
  };
}

function getSymbolsFromTransactions(transactions) {
  const trans: Transaction[] = R.chain(source => R.concat(source.trades, source.transfers), R.values(transactions));
  const symbols = R.reduce((acc, transaction) => {
    if (transaction.type === 'BUY' || transaction.type === 'SELL') {
      acc.push(transaction.market.minor);
    } else if (transaction.type === 'DEPOSIT' || transaction.type === 'WITHDRAW') {
      acc.push(transaction.currency);
    }
    return acc;
  }, [], trans);
  return R.uniq(symbols);
}

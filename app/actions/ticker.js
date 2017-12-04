// @flow
import * as R from 'ramda';
import type { Action, Dispatch, GetState, ThunkAction } from './action.d';
import startTimer from './timer';
import type { Transaction } from './transaction.d';
import type { Wallet } from './wallet.d';
import type { TransactionsState as TransactionState } from '../reducers/transactions';
import { flattenTransactions } from '../helpers/transactions';

const REFRESH_TIME_IN_MS = 30000;

function fetchingTickerUpdate(): Action {
  return {
    type: 'LAST_UPDATED',
    key: 'ticker',
    time: new Date(),
  };
}

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
    dispatch(fetchingTickerUpdate());

    const state = getState();
    const symbols = getSymbolsFromTransactions(state.transactions, state.wallets, state.settings.fiatCurrency);
    const fsyms = symbols.from.join(',');
    const tsyms = symbols.to.join(',');
    if (fsyms && tsyms) {
      fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`)
        .then(result => result.json())
        .then(result => dispatch(receiveTickerUpdate(result.RAW)))
        .catch(error => console.error(error));
    }
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

function getSymbolsFromTransactions(
  transactions: TransactionState, wallets: Wallet[], fiatCurrency: string): { from: string[], to: string[] } {
  const walletSymbols = wallets.map(wallet => wallet.currency) || [];
  const exchangeSymbols = R.values(transactions)
    .map(exchange => exchange.balances)
    .reduce((acc, balances) => acc.concat(R.keys(balances)), []);

  const trans: Transaction[] = flattenTransactions(transactions);
  const symbols = R.reduce((acc, transaction) => {
    if (transaction.type === 'BUY' || transaction.type === 'SELL') {
      acc.from.push(transaction.market.minor);
      acc.to.push(transaction.market.major);
    } else if (transaction.type === 'DEPOSIT' || transaction.type === 'WITHDRAW') {
      acc.to.push(transaction.currency);
      acc.from.push(transaction.currency);
    }
    return acc;
  }, { from: ['BTC', ...walletSymbols, ...exchangeSymbols], to: ['BTC', fiatCurrency] }, trans);
  return R.map(R.uniq)(symbols);
}

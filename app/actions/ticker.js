// @flow
import * as R from 'ramda';
import type { Exchanges } from '../reducers/exchanges/types.d';
import type { Action, Dispatch, GetState, ThunkAction } from './action.d';
import startTimer from './timer';
import type { Wallet } from '../reducers/wallets/types.d';

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

function receiveHistory(fsym: string, tsym: string, history: [{ close: number }]): Action {
  return {
    type: 'HISTORY_UPDATE',
    fsym,
    tsym,
    history,
  };
}

function receiveCoinList(coinlist: Object): Action {
  return {
    type: 'RECEIVE_COIN_LIST',
    coinlist,
  };
}

export function requestTickerUpdate(
  extraSymbols: string[] = [], fiatCurrency?: string, cryptoCurrency?: string): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(fetchingTickerUpdate());

    const state = getState();
    const symbols = getSymbolsFromTransactions(
      state.exchanges,
      state.wallets,
      fiatCurrency || state.settings.fiatCurrency,
      cryptoCurrency || state.settings.cryptoCurrency,
      extraSymbols);
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

export function requestHistory(fsym: string, tsym: string, forceRequest: boolean = false): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const twoMinutesAgo = new Date((new Date()).getTime() - (1000 * 60 * 2));
    if (forceRequest
      || !(getState().ticker.history[fsym]
        && getState().ticker.history[fsym][tsym]
        && getState().ticker.history[fsym][tsym].lastUpdate >= twoMinutesAgo)
    ) {
      fetch(`https://min-api.cryptocompare.com/data/histominute?fsym=${fsym}&tsym=${tsym}`)
        .then(result => result.json())
        .then(result => dispatch(receiveHistory(fsym, tsym, result.Data)))
        .catch(error => console.error(error));
    }
  };
}

export function requestCoinList(): ThunkAction {
  return (dispatch: Dispatch) => {
    fetch('https://min-api.cryptocompare.com/data/all/coinlist')
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
  exchanges: Exchanges,
  wallets: Wallet[],
  fiatCurrency: string,
  cryptoCurrency: string,
  extraSymbols: string[]): { from: string[], to: string[] } {
  const walletSymbols = wallets.map(wallet => wallet.currency) || [];
  const exchangeSymbols = R.values(exchanges)
    .map(exchange => exchange.balances)
    .reduce((acc, balances) => acc.concat(R.keys(balances)), []);

  return R.map(R.uniq)(
    {
      from: [cryptoCurrency, ...walletSymbols, ...exchangeSymbols, ...extraSymbols],
      to: [cryptoCurrency, fiatCurrency],
    });
}

import * as R from 'ramda';
import { Coinlist } from '../reducers/coinlist';
import { Exchanges } from '../reducers/exchanges.types';
import { Ticker } from '../reducers/ticker';
import { Wallet } from '../reducers/wallets.types';
import { Action, Dispatch, GetState, ThunkAction } from './actions.types';
import startTimer from './timer';

const REFRESH_TIME_IN_MS = 30000;

function fetchingTickerUpdate(): Action {
  return {
    type: 'LAST_UPDATED',
    key: 'ticker',
    time: new Date(),
  };
}

function receiveTickerUpdate(ticker: Ticker): Action {
  return {
    type: 'TICKER_UPDATE',
    ticker,
  };
}

function receiveHistory(fsym: string, tsym: string, history: Array<{ close: number }>): Action {
  return {
    type: 'HISTORY_UPDATE',
    fsym,
    tsym,
    history,
  };
}

function receiveCoinList(coinlist: Coinlist): Action {
  return {
    type: 'RECEIVE_COIN_LIST',
    coinlist,
  };
}

export function requestTickerUpdate(
  extraSymbols: string[] = [],
  fiatCurrency?: string,
  cryptoCurrency?: string
): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(fetchingTickerUpdate());

    const state = getState();
    const symbols = getSymbolsFromTransactions(
      state.exchanges,
      state.wallets,
      fiatCurrency || state.settings.fiatCurrency,
      cryptoCurrency || state.settings.cryptoCurrency,
      extraSymbols
    );
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

export function requestHistory(
  fsym: string,
  tsym: string,
  forceRequest: boolean = false
): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const twoMinutesAgo = new Date(new Date().getTime() - 1000 * 60 * 2);
    if (
      forceRequest ||
      !(
        getState().ticker.history[fsym] &&
        getState().ticker.history[fsym][tsym] &&
        getState().ticker.history[fsym][tsym].lastUpdate >= twoMinutesAgo
      )
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

export function continuouslyUpdateTicker(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timers.timers.ticker) {
      const timer = window.setInterval(() => dispatch(requestTickerUpdate()), REFRESH_TIME_IN_MS);
      dispatch(startTimer('ticker', timer));
    }
  };
}

function getSymbolsFromTransactions(
  exchanges: Exchanges,
  wallets: Wallet[],
  fiatCurrency: string,
  cryptoCurrency: string,
  extraSymbols: string[]
): { from: string[]; to: string[] } {
  const walletSymbols = wallets.map(wallet => wallet.currency) || [];
  const exchangeSymbols = R.pipe(
    R.values,
    R.map(exchange => exchange.balances),
    R.map(R.keys),
    R.reduce((acc, keys) => acc.concat(keys), [] as string[])
  )(exchanges);

  return {
    from: R.uniq([cryptoCurrency, ...walletSymbols, ...exchangeSymbols, ...extraSymbols]),
    to: [cryptoCurrency, fiatCurrency],
  };
}

import 'whatwg-fetch'; // Has to be imported before ccxt

import * as ccxt from 'ccxt';
import * as R from 'ramda';
import { Coinlist } from '../reducers/coinlist';
import { Exchange, Exchanges } from '../reducers/exchanges.types';
import { HistoryEntry, Ticker } from '../reducers/ticker';
import { Wallet } from '../reducers/wallets.types';
import { getExchanges } from '../selectors/selectGlobalState';
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

function receiveTickerUpdate(rawTicker: RawTicker): Action {
  return {
    type: 'TICKER_UPDATE',
    ticker: formatRawTicker(rawTicker),
  };
}

function receiveHistory(fsym: string, tsym: string, history: HistoryEntry): Action {
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
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(fetchingTickerUpdate());

    const state = getState();
    const symbols = getSymbolsFromTransactions(
      state.exchanges,
      state.wallets,
      fiatCurrency || state.settings.fiatCurrency,
      cryptoCurrency || state.settings.cryptoCurrency,
      extraSymbols
    );
    try {
      let ticker = await getTickerForSymbols(symbols);
      ticker = await requestMissingTickerUpdateFromExchange(ticker, getExchanges(state), symbols);
      dispatch(receiveTickerUpdate(ticker));
    } catch (error) {
      console.error(error); // TODO Show this error to the user? Logging?
    }
  };
}

const getTickerForSymbols = (symbols: Symbols) => {
  const fsyms = symbols.from.join(',');
  const tsyms = symbols.to.join(',');
  if (fsyms && tsyms) {
    return fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`
    )
      .then(result => result.json())
      .then(result => result.RAW);
  }
  return Promise.reject('No symbols');
};

const requestMissingTickerUpdateFromExchange = async (
  ticker: Ticker,
  exchanges: Exchanges,
  symbols: Symbols
) => {
  const updatedTicker: Ticker = { ...ticker };

  try {
    for (const fsym of symbols.from) {
      if (!ticker[fsym]) {
        for (const exchange of R.values(exchanges)) {
          if (exchangeHasSymbol(fsym, exchange)) {
            const connector: ccxt.Exchange = new ccxt[exchange.type](exchange.credentials);
            const markets: {
              [symbol: string]: ccxt.Market;
            } = (await connector.loadMarkets()) as any;
            const marketsForSymbol = R.values(markets).filter(market =>
              market.symbol.startsWith(fsym.toUpperCase())
            );
            for (const market of marketsForSymbol) {
              try {
                const tick = await connector.fetchTicker(market.symbol);
                updatedTicker[market.base][market.quote] = {
                  PRICE: tick.last || tick.ask,
                  CHANGEPCT24HOUR: 0,
                };
              } catch (error) {
                console.error(error);
              }
            }
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return ticker;
  }
  return updatedTicker;
};

const exchangeHasSymbol = (symbol: string, exchange: Exchange) => {
  return R.contains(symbol, R.keys(exchange.balances));
};

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

interface Symbols {
  from: string[];
  to: string[];
}

function getSymbolsFromTransactions(
  exchanges: Exchanges,
  wallets: Wallet[],
  fiatCurrency: string,
  cryptoCurrency: string,
  extraSymbols: string[]
): Symbols {
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

interface RawTicker {
  [fsym: string]: {
    [tsym: string]: RawTickerEntry;
  };
}

interface RawTickerEntry {
  CHANGEPCT24HOUR: string;
  PRICE: string;
}

function formatRawTicker(rawTicker: RawTicker) {
  const ticker = R.mapObjIndexed(
    R.mapObjIndexed((entry: RawTickerEntry) => ({
      ...entry,
      CHANGEPCT24HOUR: parseFloat(entry.CHANGEPCT24HOUR),
      PRICE: parseFloat(entry.PRICE),
    }))
  )(rawTicker);
  return ticker;
}

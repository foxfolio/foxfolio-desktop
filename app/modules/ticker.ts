import 'whatwg-fetch'; // Has to be imported before ccxt

import * as ccxt from 'ccxt';
import _ from 'lodash';
import { Action, Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { getTickerEntry } from '../helpers/ticker';
import { getExchanges, getTimers } from '../selectors/selectGlobalState';
import { Exchange, Exchanges } from './exchanges.types';
import { Ticker, TickerEntry } from './ticker.types';
import { startTimer } from './timer';
import { Wallet } from './wallets.types';

// Reducer
export default function reducer(state: Ticker = {}, action: Action): Ticker {
  switch (action.type) {
    case 'TICKER_UPDATE':
      return action.ticker;
    default:
      return state;
  }
}

// Action Creators
const REFRESH_TIME_IN_MS = 30000;

export function continuouslyUpdateTicker(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getTimers(getState()).ticker) {
      const timer = window.setInterval(() => dispatch(requestTickerUpdate()), REFRESH_TIME_IN_MS);
      dispatch(startTimer('ticker', timer));
    }
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
    fiatCurrency = fiatCurrency || state.settings.fiatCurrency;
    cryptoCurrency = cryptoCurrency || state.settings.cryptoCurrency;

    const symbols = getSymbolsFromTransactions(
      state.exchanges,
      state.wallets,
      fiatCurrency,
      cryptoCurrency,
      extraSymbols
    );
    try {
      let ticker = await getTickerForSymbols(symbols);
      ticker = calculateFiatValues(
        ticker,
        fiatCurrency,
        cryptoCurrency,
        getTickerEntry(ticker, cryptoCurrency, fiatCurrency)
      );
      ticker = await requestMissingTickerUpdateFromExchange(ticker, getExchanges(state), symbols);
      dispatch(receiveTickerUpdate(ticker));
    } catch (error) {
      console.error(error); // TODO Show this error to the user? Logging?
    }
  };
}

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

const calculateChange = (tickerEntry: any, tickerEntryFiat: any): number => {
  const open24hour = tickerEntry.OPEN24HOUR * tickerEntryFiat.OPEN24HOUR;
  const currentPrice = tickerEntry.PRICE * tickerEntryFiat.PRICE;

  return (currentPrice - open24hour) / open24hour * 100;
};

const calculateFiatValues = (
  ticker: Ticker,
  fiatCurrency: string,
  cryptoCurrency: string,
  tickerEntryFiatCrypto: TickerEntry
): Ticker => {
  return _.mapValues(ticker, (entry, asset) => {
    if (asset === fiatCurrency || asset === cryptoCurrency) {
      return entry;
    }
    return {
      ...entry,
      [fiatCurrency]: {
        ...(entry ? entry[fiatCurrency] : {}),
        CHANGEPCT24HOUR: calculateChange(
          getTickerEntry(ticker, asset, cryptoCurrency),
          tickerEntryFiatCrypto
        ),
      },
    };
  });
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
        for (const exchange of _.values(exchanges)) {
          if (exchangeHasSymbol(fsym, exchange)) {
            const connector: ccxt.Exchange = new ccxt[exchange.type](exchange.credentials);
            const markets: {
              [symbol: string]: ccxt.Market;
            } = (await connector.loadMarkets()) as any;
            const marketsForSymbol = _.values(markets).filter(market =>
              market.symbol.startsWith(fsym.toUpperCase())
            );
            for (const market of marketsForSymbol) {
              try {
                const tick = await connector.fetchTicker(market.symbol);
                updatedTicker[market.base] = {
                  ...updatedTicker[market.base],
                  [market.quote]: {
                    PRICE: tick.last || tick.ask,
                    CHANGEPCT24HOUR: 0,
                  },
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
  return _.includes(_.keys(exchange.balances), symbol);
};

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
  const exchangeSymbols = _.chain(exchanges)
    .values()
    .map(exchange => exchange.balances)
    .map(_.keys)
    .reduce((acc, keys) => acc.concat(keys), [] as string[])
    .value();

  return {
    from: _.uniq([cryptoCurrency, ...walletSymbols, ...exchangeSymbols, ...extraSymbols]),
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

function formatRawTicker(rawTicker: RawTicker): Ticker {
  return _.mapValues(rawTicker, fsymEntry =>
    _.mapValues(fsymEntry, (entry: RawTickerEntry) => ({
      ...entry,
      CHANGEPCT24HOUR: parseFloat(entry.CHANGEPCT24HOUR),
      PRICE: parseFloat(entry.PRICE),
    }))
  );
}

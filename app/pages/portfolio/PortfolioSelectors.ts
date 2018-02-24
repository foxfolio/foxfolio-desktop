import R from 'ramda';
import { createSelector } from 'reselect';
import { getTickerPrice } from '../../helpers/transactions';
import { GlobalState } from '../../reducers/index';
import { Exchanges } from '../../reducers/exchanges.types';
import { Ticker } from '../../reducers/ticker';
import { getFiatCurrencies } from '../../utils/fiatCurrencies';
import {
  Balances,
  ExchangeBalances,
  Portfolio,
  PortfolioSum,
} from './types/portfolio.types';

export const getCoinlist = (state: GlobalState) => state.coinlist;
export const getTicker = (state: GlobalState) => state.ticker.ticker;
export const getExchanges = (state: GlobalState) => state.exchanges;
export const getSettings = (state: GlobalState) => state.settings;
export const getWallets = (state: GlobalState) => state.wallets;

export const getExchangeBalances = createSelector<GlobalState, Exchanges, ExchangeBalances>(
  [getExchanges],
  exchanges => mapObject(exchange => exchange.balances, exchanges)
);

export const getFilteredExchangeBalances = createSelector(
  [getExchangeBalances, getSettings],
  (exchangeBalances, settings): ExchangeBalances =>
    mapObject(
      balance => (settings.includeFiat ? R.identity : R.omit(getFiatCurrencies()))(balance),
      exchangeBalances
    )
);

export const getWalletBalances = createSelector(
  [getWallets, getSettings],
  (wallets, settings): Balances =>
    wallets
      .filter(wallet => !(wallet.currency === settings.fiatCurrency && settings.includeFiat))
      .reduce(
        (acc, wallet) => ({
          ...acc,
          [wallet.currency]: (acc[wallet.currency] || 0) + wallet.quantity,
        }),
        {}
      )
);
export const getPortfolio = createSelector(
  [getWalletBalances, getFilteredExchangeBalances],
  (walletBalances, filteredBalances): Portfolio => {
    const reducedExchangeBalances: Balances = Object.keys(filteredBalances).reduce(
      (acc, key) => R.mergeWith((a, b) => a + b, acc, filteredBalances[key]),
      {}
    );

    return {
      total: R.mergeWith((a, b) => a + b, reducedExchangeBalances, walletBalances),
      exchanges: filteredBalances,
      wallets: walletBalances,
    };
  }
);

export const getPortfolioSum = createSelector(
  [getPortfolio, getTicker, getSettings],
  (portfolio, ticker, settings): PortfolioSum => ({
    crypto: calculateSum(ticker, portfolio.total, settings.cryptoCurrency),
    fiat: calculateSum(ticker, portfolio.total, settings.fiatCurrency),
  })
);

export const getPortfolioChange = createSelector(
  [getPortfolio, getPortfolioSum, getTicker, getSettings],
  (portfolio, sum, ticker, settings): PortfolioSum => ({
    crypto: calculateChange(ticker, portfolio.total, sum.crypto, settings.cryptoCurrency),
    fiat: calculateChange(ticker, portfolio.total, sum.fiat, settings.fiatCurrency),
  })
);

function calculateSum(ticker: Ticker, portfolio: Balances, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + getTickerPrice(ticker, asset, currency) * portfolio[asset], 0);
}

function calculateChange(ticker: Ticker, portfolio: Balances, sum: number, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .filter(asset => asset !== currency)
    .reduce(
      (acc, asset) =>
        acc +
        ticker[asset][currency].CHANGEPCT24HOUR *
          (getTickerPrice(ticker, asset, currency) * portfolio[asset] / sum),
      0
    );
}

const mapObject = <T, K extends keyof T, V>(fn: (item: T[K]) => V, object: T): Record<K, V> =>
  Object.assign({}, ...Object.keys(object).map(k => ({ [k]: fn(object[k]) })));

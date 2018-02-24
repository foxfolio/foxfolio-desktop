import R from 'ramda';
import { createSelector } from 'reselect';
import { getTickerPrice } from '../../../helpers/transactions';
import { Ticker } from '../../../reducers/ticker';
import { getSettings, getTicker } from '../../../selectors/selectGlobalState';
import { Balances, Portfolio, PortfolioSum } from '../types/portfolio.types';
import { getFilteredExchangeBalances, getWalletBalances } from './selectBalances';

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
    .filter(asset => ticker && ticker[asset])
    .reduce((acc, asset) => acc + getTickerPrice(ticker, asset, currency) * portfolio[asset], 0);
}

function calculateChange(ticker: Ticker, portfolio: Balances, sum: number, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker && ticker[asset])
    .filter(asset => asset !== currency)
    .reduce(
      (acc, asset) =>
        acc +
        ticker[asset][currency].CHANGEPCT24HOUR *
          (getTickerPrice(ticker, asset, currency) * portfolio[asset] / sum),
      0
    );
}

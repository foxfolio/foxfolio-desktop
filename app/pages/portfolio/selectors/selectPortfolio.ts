import _ from 'lodash';
import { createSelector } from 'reselect';
import { getTickerEntry } from '../../../helpers/ticker';
import { Ticker } from '../../../reducers/ticker';
import { getSettings, getTicker } from '../../../selectors/selectGlobalState';
import { Balances, Portfolio, PortfolioSum } from '../types/portfolio.types';
import { getFilteredExchangeBalances, getWalletBalances } from './selectBalances';

export const getPortfolio = createSelector(
  [getWalletBalances, getFilteredExchangeBalances],
  (walletBalances, filteredBalances): Portfolio => {
    const reducedExchangeBalances: Balances = _.values(filteredBalances).reduce(
      (acc, value) => _.mergeWith(acc, value, _.add),
      {}
    );

    return {
      total: _.mergeWith(reducedExchangeBalances, walletBalances, _.add),
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
  return Object.keys(portfolio).reduce(
    (acc, asset) => acc + getTickerEntry(ticker, asset, currency).PRICE * portfolio[asset],
    0
  );
}

function calculateChange(ticker: Ticker, portfolio: Balances, sum: number, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker && ticker[asset])
    .filter(asset => asset !== currency)
    .reduce(
      (acc, asset) =>
        acc +
        getTickerEntry(ticker, asset, currency).CHANGEPCT24HOUR *
          (getTickerEntry(ticker, asset, currency).PRICE * portfolio[asset] / sum),
      0
    );
}

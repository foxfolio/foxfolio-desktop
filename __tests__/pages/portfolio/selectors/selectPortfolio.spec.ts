import {
  getPortfolio,
  getPortfolioChange,
  getPortfolioSum,
} from '../../../../app/pages/portfolio/selectors/selectPortfolio';
import { GlobalState } from '../../../../app/reducers';
import { emptyState } from '../../../emptyState';

let state: GlobalState;

beforeEach(() => {
  state = {
    ...emptyState,
    exchanges: {
      ...emptyState.exchanges,
      key: { ...emptyState.exchanges.key, balances: { BTC: 2, ETH: 5, LTC: 0.00001, USD: 1 } },
    },
    wallets: [
      { currency: 'BTC', quantity: 5, address: 'btc' },
      { currency: 'ETH', quantity: 4, address: 'eth' },
    ],
    ticker: {
      ...emptyState.ticker,
      ticker: {
        BTC: {
          USD: { PRICE: 10000, CHANGEPCT24HOUR: 1 },
        },
        ETH: {
          USD: { PRICE: 1000, CHANGEPCT24HOUR: 2 },
          BTC: { PRICE: 0.1, CHANGEPCT24HOUR: 3 },
        },
        LTC: {
          USD: { PRICE: 100, CHANGEPCT24HOUR: 4 },
          BTC: { PRICE: 0.01, CHANGEPCT24HOUR: 5 },
        },
        USD: { BTC: { PRICE: 0.0001, CHANGEPCT24HOUR: -1 } },
      },
    },
  };
});

test('getPortfolio', () => {
  expect(getPortfolio(state)).toEqual({
    exchanges: {
      key: {
        BTC: 2,
        USD: 1,
        ETH: 5,
        LTC: 0.00001,
      },
    },
    total: { USD: 1, BTC: 7, ETH: 9, LTC: 0.00001 },
    wallets: {
      BTC: 5,
      ETH: 4,
    },
  });
});

test('getPortfolioSum', () => {
  const portfolioSum = getPortfolioSum(state);
  expect(portfolioSum.crypto).toBeCloseTo(7.9000001);
  expect(portfolioSum.fiat).toBeCloseTo(79001.001);
});

test('getPortfolioChange', () => {
  const portfolioChange = getPortfolioChange(state);
  expect(portfolioChange.crypto).toBeCloseTo(0.3417722);
  expect(portfolioChange.fiat).toBeCloseTo(1.11391);
});

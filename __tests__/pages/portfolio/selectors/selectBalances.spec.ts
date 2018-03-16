import {
  getExchangeBalances,
  getFilteredExchangeBalances,
  getWalletBalances,
} from '../../../../app/pages/portfolio/selectors/selectBalances';
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
      },
    },
  };
});

test('getExchangeBalances', () => {
  expect(getExchangeBalances(state)).toEqual({
    key: { USD: 1, BTC: 2, ETH: 5, LTC: 0.00001 },
  });
});

test('getWalletBalances', () => {
  expect(getWalletBalances(state)).toEqual({
    BTC: 5,
    ETH: 4,
  });
});

describe('getFilteredExchangeBalances', () => {
  test('hide fiat currency, hide zero balances', () => {
    state.settings = {
      ...state.settings,
      hideZeroBalances: true,
      includeFiat: false,
    };
    expect(getFilteredExchangeBalances(state)).toEqual({ key: { BTC: 2, ETH: 5 } });
  });

  test('hide fiat currency, show zero balances', () => {
    state.settings = {
      ...state.settings,
      hideZeroBalances: false,
      includeFiat: false,
    };
    expect(getFilteredExchangeBalances(state)).toEqual({
      key: { BTC: 2, ETH: 5, LTC: 0.00001 },
    });
  });

  test('shows fiat currency, show zero balances', () => {
    state.settings = {
      ...state.settings,
      hideZeroBalances: false,
      includeFiat: true,
    };
    expect(getFilteredExchangeBalances(state)).toEqual({
      key: { BTC: 2, ETH: 5, LTC: 0.00001, USD: 1 },
    });
  });

  test('shows fiat currency, hide zero balances', () => {
    state.settings = {
      ...state.settings,
      hideZeroBalances: true,
      includeFiat: true,
    };
    expect(getFilteredExchangeBalances(state)).toEqual({ key: { BTC: 2, ETH: 5, USD: 1 } });
  });
});

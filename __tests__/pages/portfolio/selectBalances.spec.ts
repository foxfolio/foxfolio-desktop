import {
  getExchangeBalances,
  getFilteredExchangeBalances,
  getWalletBalances,
} from '../../../app/pages/portfolio/selectors/selectBalances';
import { GlobalState } from '../../../app/reducers';

let state: GlobalState;

beforeEach(() => {
  state = {
    exchanges: {
      key: {
        balances: {
          USD: 1,
          BTC: 2,
          ETH: 5,
          LTC: 0.00001,
        },
      },
    },
    wallets: [{ currency: 'BTC', quantity: 5 }, { currency: 'ETH', quantity: 4 }],
    ticker: {
      ticker: {
        BTC: {
          USD: { PRICE: 10000 },
        },
        ETH: {
          USD: { PRICE: 1000 },
        },
        LTC: {
          USD: { PRICE: 100 },
        },
      },
    },
    settings: {
      hideZeroBalances: false,
      includeFiat: true,
      fiatCurrency: 'USD',
    },
  } as any;
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

import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { GlobalState } from '../../app/modules';
import exchanges, { fetchAllExchangeBalances } from '../../app/modules/exchanges';
import { initialSettings } from '../../app/modules/settings.types';
import { getExchanges } from '../../app/selectors/selectGlobalState';
import { Store } from '../../app/store/configureStore';

import ccxt from 'ccxt';
jest.mock('ccxt');

const fakeFetchTotalBalance = jest.fn();
const fakeBinance = jest.fn(() => ({
  fetchTotalBalance: fakeFetchTotalBalance,
  has: {},
}));
ccxt.binance = fakeBinance as any;

let store: Store;

beforeEach(() => {
  const initialState: Partial<GlobalState> = {
    wallets: {},
    exchanges: {
      id: {
        id: 'id',
        type: 'binance',
        credentials: {
          apiKey: 'apiKey',
          secret: 'secret',
        },
        balances: {},
        trades: [],
        ledger: [],
      },
    },
  };
  store = createStore(
    combineReducers({
      exchanges,
      settings: jest.fn().mockReturnValue(initialSettings),
      wallets: jest.fn().mockReturnValue([]),
    } as any),
    initialState as GlobalState,
    applyMiddleware(thunk)
  ) as Store;
});

describe('fetchAllBalances', () => {
  test('updates the balances in store', async () => {
    fakeFetchTotalBalance.mockResolvedValue({ BTC: 5 });

    await store.dispatch(fetchAllExchangeBalances());

    expect(getExchanges(store.getState())).toMatchObject({
      id: {
        id: 'id',
        type: 'binance',
        balances: { BTC: 5 },
        trades: [],
        ledger: [],
      },
    });
  });

  test('ignores empty balances', async () => {
    fakeFetchTotalBalance.mockResolvedValue({ BTC: 5, LTC: 0 });

    await store.dispatch(fetchAllExchangeBalances());

    expect(getExchanges(store.getState())).toMatchObject({
      id: {
        id: 'id',
        type: 'binance',
        balances: { BTC: 5 },
        trades: [],
        ledger: [],
      },
    });
  });

  test('stores the error message on failure', async () => {
    fakeFetchTotalBalance.mockRejectedValue({ message: 'Error Message' });

    await store.dispatch(fetchAllExchangeBalances());

    expect(getExchanges(store.getState())).toMatchObject({
      id: {
        id: 'id',
        type: 'binance',
        balances: {},
        error: 'Error Message',
        trades: [],
        ledger: [],
      },
    });
  });
});

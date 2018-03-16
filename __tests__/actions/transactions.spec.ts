import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { fetchAllBalances } from '../../app/actions/transactions';
import { GlobalState } from '../../app/reducers';
import { exchanges } from '../../app/reducers/exchanges';
import { initialSettings } from '../../app/reducers/settings';
import { getExchanges } from '../../app/selectors/selectGlobalState';

import ccxt from 'ccxt';
jest.mock('ccxt');

const fakeFetchTotalBalance = jest.fn();
const fakeBinance = jest.fn(() => ({
  fetchTotalBalance: fakeFetchTotalBalance,
}));
ccxt.binance = fakeBinance as any;

let store: Store<GlobalState>;

beforeEach(() => {
  const initialState: Partial<GlobalState> = {
    wallets: [],
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
  );
});

describe('fetchAllBalances', () => {
  test('updates the balances in store', async () => {
    fakeFetchTotalBalance.mockResolvedValue({ BTC: 5 });

    await store.dispatch(fetchAllBalances());

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

    await store.dispatch(fetchAllBalances());

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

    await store.dispatch(fetchAllBalances());

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

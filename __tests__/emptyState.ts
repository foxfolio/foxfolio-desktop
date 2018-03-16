import { GlobalState } from '../app/reducers';
import { initialSettings } from '../app/reducers/settings';

export const emptyState: GlobalState = {
  coinlist: {},
  timers: { timers: {}, lastUpdated: {} },
  trades: {},
  exchanges: {
    key: {
      id: 'key',
      type: 'type',
      credentials: {} as any,
      ledger: [],
      trades: [],
      balances: {},
    },
  },
  wallets: [],
  ticker: {
    ticker: {},
    history: {},
    pricesForTime: {},
  },
  settings: initialSettings,
};

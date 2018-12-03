import { GlobalState } from '../app/modules';
import { initialSettings } from '../app/modules/settings.types';

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
  history: {},
  prices: {},
  wallets: {},
  ticker: {},
  settings: initialSettings,
};

import { GlobalState } from '../reducers';

export const getCoinlist = (state: GlobalState) => state.coinlist;
export const getHistory = (state: GlobalState) => state.ticker.history;
export const getTicker = (state: GlobalState) => state.ticker.ticker;
export const getExchanges = (state: GlobalState) => state.exchanges;
export const getSettings = (state: GlobalState) => state.settings;
export const getWallets = (state: GlobalState) => state.wallets;

import { GlobalState } from '../modules';

export const getCoinlist = (state: GlobalState) => state.coinlist;
export const getHistory = (state: GlobalState) => state.history;
export const getPrices = (state: GlobalState) => state.prices;
export const getTicker = (state: GlobalState) => state.ticker;
export const getTimers = (state: GlobalState) => state.timers.timers;
export const getExchanges = (state: GlobalState) => state.exchanges;
export const getSettings = (state: GlobalState) => state.settings;
export const getWallets = (state: GlobalState) => state.wallets;

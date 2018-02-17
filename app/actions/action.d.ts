import { SettingsType } from '../reducers/settings';
import { HistoryEntry, Ticker } from 'reducers/ticker';
import { Wallet } from 'reducers/wallets';
import { Coinlist } from 'reducers/coinlist';
import { ExchangeActions } from '../reducers/exchanges/actions.d';
import { GlobalState } from '../reducers';
import { ThunkAction as ReduxThunkAction } from 'redux-thunk';
import { Dispatch as ReduxDispatch } from 'redux'

export type Action =
  | ExchangeActions
  | { type: 'ADD_WALLET', wallet: Wallet }
  | { type: 'EDIT_WALLET', wallet: Wallet, newWallet: Wallet }
  | { type: 'DELETE_WALLET', wallet: Wallet }
  | { type: 'LAST_UPDATED', key: string, time: Date }
  | { type: 'TICKER_UPDATE', ticker: Ticker }
  | { type: 'HISTORY_UPDATE', fsym: string, tsym: string, history: HistoryEntry }
  | { type: 'START_TIMER', name: string, timer: number }
  | { type: 'RECEIVE_COIN_LIST', coinlist: Coinlist }
  | { type: 'SAVE_SETTINGS', settings: SettingsType };

export type Dispatch = ReduxDispatch<GlobalState>;
export type GetState = () => GlobalState;
export type ThunkAction = ReduxThunkAction<void | Promise<void>, GlobalState, {}>;

import { Dispatch as ReduxDispatch } from 'redux';
import { ThunkAction as ReduxThunkAction } from 'redux-thunk';
import { GlobalState } from '../reducers';
import { Coinlist } from '../reducers/coinlist';
import { ExchangeActions } from '../reducers/exchanges.types';
import { SettingsType } from '../reducers/settings';
import { HistoryData, Ticker } from '../reducers/ticker';
import { Wallet } from '../reducers/wallets.types';
import { TradeActions } from './trades';

export type Action =
  | ExchangeActions
  | TradeActions
  | { type: 'ADD_WALLET'; wallet: Wallet }
  | { type: 'EDIT_WALLET'; wallet: Wallet; newWallet: Wallet }
  | { type: 'DELETE_WALLET'; wallet: Wallet }
  | { type: 'LAST_UPDATED'; key: string; time: Date }
  | { type: 'TICKER_UPDATE'; ticker: Ticker }
  | { type: 'HISTORY_UPDATE'; fsym: string; tsym: string; history: HistoryData }
  | { type: 'START_TIMER'; name: string; timer: number }
  | { type: 'RECEIVE_COIN_LIST'; coinlist: Coinlist }
  | { type: 'SAVE_SETTINGS'; settings: SettingsType };

export type Dispatch = ReduxDispatch<GlobalState>;
export type GetState = () => GlobalState;
export type ThunkAction = ReduxThunkAction<void | Promise<void>, GlobalState, {}>;

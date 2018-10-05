import { ThunkAction as ReduxThunkAction, ThunkDispatch } from 'redux-thunk';
import { GlobalState } from '../modules';
import { Coinlist } from '../modules/coinlist.types';
import { ExchangeActions } from '../modules/exchanges.types';
import { SettingsType } from '../modules/settings.types';
import { HistoryData, Ticker } from '../modules/ticker.types';
import { Wallet } from '../modules/wallets.types';
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

export type Dispatch = ThunkDispatch<GlobalState, void, Action>;
export type GetState = () => GlobalState;
export type ThunkAction = ReduxThunkAction<void | Promise<void>, GlobalState, void, Action>;

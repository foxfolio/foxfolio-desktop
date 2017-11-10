// @flow
import type { SettingsType } from '../reducers/settings';

export type Action =
  | { type: 'ADD_SOURCE', source: Object }
  | { type: 'EDIT_SOURCE', source: Object, newSource: Object }
  | { type: 'ADD_WALLET', wallet: Object }
  | { type: 'EDIT_WALLET', wallet: Object, newWallet: Object }
  | { type: 'REQUEST_TRANSACTIONS', source: Object }
  | { type: 'RECEIVE_TRANSACTIONS', exchange: string, trades: Object[], transfers: Object[] }
  | { type: 'FAILED_TRANSACTION', exchange: string, error: string }
  | { type: 'TICKER_UPDATE', ticker: Object }
  | { type: 'START_TIMER', name: string, timer: Object }
  | { type: 'RECEIVE_COIN_LIST', coinlist: Object }
  | { type: 'SAVE_SETTINGS', settings: SettingsType }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

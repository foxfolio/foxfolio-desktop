// @flow
import type { SettingsType } from '../reducers/settings';
import type { Exchange } from './exchange.d';
import type { Wallet } from './wallet.d';
import type { Trade, Transfer } from './transaction.d';

export type Action =
  | {| type: 'ADD_SOURCE', source: Exchange |}
  | {| type: 'EDIT_SOURCE', source: Exchange, newSource: Exchange |}
  | {| type: 'ADD_WALLET', wallet: Wallet |}
  | {| type: 'EDIT_WALLET', wallet: Wallet, newWallet: Wallet |}
  | {| type: 'REQUEST_TRANSACTIONS', source: Exchange |}
  | {| type: 'RECEIVE_TRANSACTIONS', exchange: Exchange, trades: Trade[], transfers: Transfer[] |}
  | {| type: 'RECEIVE_TRADES', exchange: Exchange, trades: Trade[] |}
  | {| type: 'RECEIVE_TRANSFERS', exchange: Exchange, transfers: Transfer[] |}
  | {| type: 'FAILED_TRANSACTION_REQUEST', exchange: Exchange, error: string |}
  | {| type: 'TICKER_UPDATE', ticker: Object |}
  | {| type: 'START_TIMER', name: string, timer: Object |}
  | {| type: 'RECEIVE_COIN_LIST', coinlist: Object |}
  | {| type: 'SAVE_SETTINGS', settings: SettingsType |};

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

// @flow
import type { SettingsType } from '../reducers/settings';
import type { Wallet } from './wallet.d';
import type { ExchangeActions } from '../reducers/exchanges/actions.d';

export type Action =
  | ExchangeActions
  | {| type: 'ADD_WALLET', wallet: Wallet |}
  | {| type: 'EDIT_WALLET', wallet: Wallet, newWallet: Wallet |}
  | {| type: 'DELETE_WALLET', wallet: Wallet |}
  | {| type: 'LAST_UPDATED', key: string, time: Date |}
  | {| type: 'TICKER_UPDATE', ticker: Object |}
  | {| type: 'START_TIMER', name: string, timer: Object |}
  | {| type: 'RECEIVE_COIN_LIST', coinlist: Object |}
  | {| type: 'SAVE_SETTINGS', settings: SettingsType |};

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

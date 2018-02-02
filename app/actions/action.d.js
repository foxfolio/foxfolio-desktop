// @flow
import type { SettingsType } from '../reducers/settings';
import type { History, Ticker } from '../reducers/ticker/types.d';
import type { Wallet } from '../reducers/wallets/types.d';
import type { Coinlist } from '../reducers/coinlist/types.d';
import type { ExchangeActions } from '../reducers/exchanges/actions.d';
import type { GlobalState } from '../reducers';

export type Action =
  | ExchangeActions
  | {| type: 'ADD_WALLET', wallet: Wallet |}
  | {| type: 'EDIT_WALLET', wallet: Wallet, newWallet: Wallet |}
  | {| type: 'DELETE_WALLET', wallet: Wallet |}
  | {| type: 'LAST_UPDATED', key: string, time: Date |}
  | {| type: 'TICKER_UPDATE', ticker: Ticker |}
  | {| type: 'HISTORY_UPDATE', fsym: string, tsym: string, history: History |}
  | {| type: 'START_TIMER', name: string, timer: IntervalID |}
  | {| type: 'RECEIVE_COIN_LIST', coinlist: Coinlist |}
  | {| type: 'SAVE_SETTINGS', settings: SettingsType |};

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => GlobalState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

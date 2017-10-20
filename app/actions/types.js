// @flow

export type Action =
  | { type: 'ADD_SOURCE', source: Object }
  | { type: 'EDIT_SOURCE', source: Object, newSource: Object }
  | { type: 'REQUEST_TRANSACTIONS', source: Object }
  | { type: 'RECEIVE_TRANSACTIONS', exchange: string, trades: Object[], transfers: Object[] }
  | { type: 'FAILED_TRANSACTIONS', exchange: string, error: string }
  | { type: 'TICKER_UPDATE', ticker: Object }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

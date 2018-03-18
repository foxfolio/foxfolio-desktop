import { Reducer } from 'redux';
import { Action } from '../actions/actions.types';

export interface Coinlist {
  [symbol: string]: CoinlistEntry;
}

export interface CoinlistEntry {
  FullName: string;
  ImageUrl: string;
  SortOrder: string;
}

export const coinlist = (state: Coinlist = {}, action: Action): Coinlist => {
  switch (action.type) {
    case 'RECEIVE_COIN_LIST':
      return action.coinlist;
    default:
      return state;
  }
};

import {Action} from 'actions/action.d';

export interface Coinlist {
  [symbol: string]: CoinlistEntry
}

export interface CoinlistEntry {
  FullName: string,
  ImageUrl: string
}


export function coinlist(state: Coinlist = {}, action: Action): Coinlist {
  switch (action.type) {
    case 'RECEIVE_COIN_LIST':
      return action.coinlist;
    default:
      return state;
  }
}

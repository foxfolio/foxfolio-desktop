// @flow
import type { Action } from '../../actions/action.d';
import type { Coinlist } from './types.d';

export function coinlist(state: Coinlist = {}, action: Action): Coinlist {
  switch (action.type) {
    case 'RECEIVE_COIN_LIST':
      return action.coinlist;
    default:
      return state;
  }
}

// @flow
import type { Action } from '../actions/types';

export default function coinlist(state: Object = {}, action: Action) {
  switch (action.type) {
    case 'RECEIVE_COIN_LIST':
      return action.coinlist;
    default:
      return state;
  }
}

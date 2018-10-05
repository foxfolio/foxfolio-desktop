import { Action } from '../actions/actions.types';
import { Coinlist } from './coinlist.types';

export const coinlist = (state: Coinlist = {}, action: Action): Coinlist => {
  switch (action.type) {
    case 'RECEIVE_COIN_LIST':
      return action.coinlist;
    default:
      return state;
  }
};

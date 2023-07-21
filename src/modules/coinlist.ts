import axios from 'axios';
import { Action, Dispatch, ThunkAction } from '../actions/actions.types';
import { Coinlist } from './coinlist.types';

// Reducer
export default function reducer(state: Coinlist = {}, action: Action): Coinlist {
  switch (action.type) {
    case 'RECEIVE_COIN_LIST':
      return action.coinlist;
    default:
      return state;
  }
}

// Action Creators
export function requestCoinList(): ThunkAction {
  return async (dispatch: Dispatch) => {
    await axios
      .get<{ Data: Coinlist }>('https://min-api.cryptocompare.com/data/all/coinlist')
      .then(response => response.data)
      .then(data => dispatch(receiveCoinList(data.Data)))
      .catch(error => console.error(error));
  };
}

export function receiveCoinList(coinlist: Coinlist): Action {
  return {
    type: 'RECEIVE_COIN_LIST',
    coinlist,
  };
}

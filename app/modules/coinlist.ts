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
  return (dispatch: Dispatch) => {
    fetch('https://min-api.cryptocompare.com/data/all/coinlist')
      .then(result => result.json())
      .then(result => dispatch(receiveCoinList(result.Data)))
      .catch(error => console.error(error));
  };
}

export function receiveCoinList(coinlist: Coinlist): Action {
  return {
    type: 'RECEIVE_COIN_LIST',
    coinlist,
  };
}

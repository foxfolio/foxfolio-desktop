import _ from 'lodash';
import { Action, Dispatch, ThunkAction } from '../actions/actions.types';
import { requestTickerUpdate } from './ticker';
import { Wallet } from './wallets.types';

// Reducer
export default function reducer(state: Wallet[] = [], action: Action): Wallet[] {
  switch (action.type) {
    case 'ADD_WALLET':
      return [...state, action.wallet];
    case 'EDIT_WALLET':
      return [..._.reject(state, item => _.isEqual(item, action.wallet)), action.newWallet];
    case 'DELETE_WALLET':
      return _.reject(state, item => _.isEqual(item, action.wallet));
    default:
      return state;
  }
}

// Action Creators
export function addWallet(wallet: Wallet): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate([wallet.currency]));
    dispatch({
      type: 'ADD_WALLET',
      wallet,
    });
  };
}

export function editWallet(wallet: Wallet, newWallet: Wallet): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate([wallet.currency]));
    dispatch({
      type: 'EDIT_WALLET',
      wallet,
      newWallet,
    });
  };
}

export function deleteWallet(wallet: Wallet): Action {
  return {
    type: 'DELETE_WALLET',
    wallet,
  };
}

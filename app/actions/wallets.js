// @flow
import type { ThunkAction } from './action.d';
import type { Wallet } from './wallet.d';

export function addWallet(wallet: Wallet): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'ADD_WALLET',
      wallet,
    });
  };
}

export function editWallet(wallet: Wallet, newWallet: Wallet): ThunkAction {
  return dispatch => {
    dispatch({
      type: 'EDIT_WALLET',
      wallet,
      newWallet,
    });
  };
}

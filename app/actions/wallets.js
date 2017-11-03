// @flow
import type { ThunkAction } from './types';
import type { walletType } from '../reducers/wallets';

export function addWallet(wallet: walletType): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'ADD_WALLET',
      wallet,
    });
  };
}

export function editWallet(wallet: walletType, newWallet: walletType): ThunkAction {
  return dispatch => {
    dispatch({
      type: 'EDIT_WALLET',
      wallet,
      newWallet,
    });
  };
}

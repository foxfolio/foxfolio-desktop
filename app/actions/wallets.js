// @flow
import type { Action, ThunkAction } from './action.d';
import type { Wallet } from './wallet.d';
import { requestTickerUpdate } from './ticker';

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

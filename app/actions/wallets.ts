import { Wallet } from '../reducers/wallets.types';
import { Action, Dispatch, ThunkAction } from './actions.types';
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

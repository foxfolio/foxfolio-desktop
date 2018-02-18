import 'redux-thunk';
import { Dispatch } from 'redux';
import { Action, ThunkAction } from './actions.types';
import { Wallet } from 'reducers/wallets';
import { requestTickerUpdate } from './ticker';
import { GlobalState } from '../reducers';

export function addWallet(wallet: Wallet): ThunkAction {
  return (dispatch: Dispatch<GlobalState>) => {
    dispatch(requestTickerUpdate([wallet.currency]));
    dispatch({
      type: 'ADD_WALLET',
      wallet,
    });
  };
}

export function editWallet(wallet: Wallet, newWallet: Wallet): ThunkAction {
  return (dispatch: Dispatch<GlobalState>) => {
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

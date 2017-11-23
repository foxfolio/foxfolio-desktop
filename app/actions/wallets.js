// @flow
import type { Action } from './action.d';
import type { Wallet } from './wallet.d';

export function addWallet(wallet: Wallet): Action {
  return {
    type: 'ADD_WALLET',
    wallet,
  };
}

export function editWallet(wallet: Wallet, newWallet: Wallet): Action {
  return {
    type: 'EDIT_WALLET',
    wallet,
    newWallet,
  };
}

export function deleteWallet(wallet: Wallet): Action {
  return {
    type: 'DELETE_WALLET',
    wallet,
  };
}

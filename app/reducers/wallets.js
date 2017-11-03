// @flow
import R from 'ramda';
import type { Action } from '../actions/types';

export type walletType = {
  currency: string,
  address: string
};

export default function wallets(state: walletType[] = [], action: Action) {
  switch (action.type) {
    case 'ADD_WALLET':
      return [...state, action.wallet];
    case 'EDIT_WALLET':
      return [...R.reject(R.equals(action.wallet), state), action.newWallet];
    default:
      return state;
  }
}

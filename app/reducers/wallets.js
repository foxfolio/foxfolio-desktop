// @flow
import R from 'ramda';
import type { Action } from '../actions/action.d';
import type { Wallet } from '../actions/wallet.d';

export default function wallets(state: Wallet[] = [], action: Action) {
  switch (action.type) {
    case 'ADD_WALLET':
      return [...state, action.wallet];
    case 'EDIT_WALLET':
      return [...R.reject(R.equals(action.wallet), state), action.newWallet];
    default:
      return state;
  }
}

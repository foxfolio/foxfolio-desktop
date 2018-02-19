import R from 'ramda';
import { Action } from '../../actions/actions.types';

export interface Wallet {
  currency: string;
  address: string;
  quantity: number;
  note?: string;
}

export function wallets(state: Wallet[] = [], action: Action): Wallet[] {
  switch (action.type) {
    case 'ADD_WALLET':
      return [...state, action.wallet];
    case 'EDIT_WALLET':
      return [...R.reject(R.equals(action.wallet), state), action.newWallet];
    case 'DELETE_WALLET':
      return R.reject(R.equals(action.wallet), state);
    default:
      return state;
  }
}

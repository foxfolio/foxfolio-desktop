import _ from 'lodash';
import { Action } from '../actions/actions.types';
import { Wallet } from './wallets.types';

export function wallets(state: Wallet[] = [], action: Action): Wallet[] {
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

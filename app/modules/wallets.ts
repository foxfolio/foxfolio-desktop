import _ from 'lodash';
import { Action, Dispatch, ThunkAction } from '../actions/actions.types';
import { generateId } from '../helpers/reducers';
import { requestTickerUpdate } from './ticker';
import {
  AddWalletAction,
  DeleteWalletAction,
  EditWalletAction,
  Wallet,
  Wallets,
} from './wallets.types';

// Reducer
export default function reducer(state: Wallets = {}, action: Action): Wallets {
  switch (action.type) {
    case 'ADD_WALLET':
      return addWalletToState(state, action);
    case 'EDIT_WALLET':
      return editWalletInState(state, action);
    case 'DELETE_WALLET':
      return deleteWalletFromState(state, action);
    default:
      return state;
  }
}

// Action Creators
export function addWallet(wallet: Wallet): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate([wallet.currency]));
    dispatch({
      type: 'ADD_WALLET',
      wallet,
    });
  };
}

export function editWallet(id: string, updatedWallet: Wallet): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate([updatedWallet.currency]));
    dispatch({
      type: 'EDIT_WALLET',
      id,
      updatedWallet,
    });
  };
}

export function deleteWallet(id: string): Action {
  return {
    type: 'DELETE_WALLET',
    id,
  };
}

// State Helpers
function addWalletToState(state: Wallets, action: AddWalletAction): Wallets {
  const newWallet: Wallet = {
    ...action.wallet,
    id: generateId(Object.keys(state)),
  };
  return { ...state, [newWallet.id]: newWallet };
}

function editWalletInState(state: Wallets, action: EditWalletAction): Wallets {
  return { ...state, [action.id]: action.updatedWallet };
}

function deleteWalletFromState(state: Wallets, action: DeleteWalletAction): Wallets {
  return _.omit(state, action.id);
}

import _ from 'lodash';
import { Action, Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { generateId } from '../helpers/reducers';
import { getWallets } from '../selectors/selectGlobalState';
import { requestTickerUpdate } from './ticker';
import { setLastUpdate, WALLET_BALANCE_TIMER } from './timer';
import {
  AddWalletAction,
  DeleteWalletAction,
  EditWalletAction,
  FailedWalletRequestAction,
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
    case 'FAILED_WALLET_REQUEST_ACTION':
      return addFailedRequestToState(state, action);
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
    dispatch(fetchAllWalletBalances());
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
    dispatch(fetchAllWalletBalances());
  };
}

export function deleteWallet(id: string): Action {
  return {
    type: 'DELETE_WALLET',
    id,
  };
}

function failedRequest(id: string, error: string): FailedWalletRequestAction {
  return {
    type: 'FAILED_WALLET_REQUEST_ACTION',
    id,
    error,
  };
}

export function fetchAllWalletBalances(): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(setLastUpdate(WALLET_BALANCE_TIMER));
    const wallets = getWallets(getState());
    await Promise.all(_.map(wallets, wallet => dispatch(fetchBalanceForWallet(wallet))));
  };
}

export function supportsAutoUpdate(currency: string) {
  return ['BTC', 'ETH'].includes(currency);
}

export function fetchBalanceForWallet(wallet: Wallet): ThunkAction {
  return async dispatch => {
    if (wallet.address) {
      if (wallet.currency === 'BTC') {
        const result = await fetch(`https://blockchain.info/rawaddr/${wallet.address}`);
        if (!result.ok) {
          dispatch(failedRequest(wallet.id, await result.text()));
        } else {
          const resultJson = await result.json();
          const balance = resultJson.final_balance / 1e8;
          dispatch({
            type: 'EDIT_WALLET',
            id: wallet.id,
            updatedWallet: { ...wallet, quantity: balance },
          });
        }
      } else if (wallet.currency === 'ETH') {
        const result = await fetch(
          `https://api.blockcypher.com/v1/eth/main/addrs/${wallet.address}/balance`
        );
        const resultJson = await result.json();
        if (!result.ok) {
          dispatch(failedRequest(wallet.id, resultJson.error));
        } else {
          const balance = resultJson.final_balance / 1e18;
          dispatch({
            type: 'EDIT_WALLET',
            id: wallet.id,
            updatedWallet: { ...wallet, quantity: balance },
          });
        }
      }
    }
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

function addFailedRequestToState(state: Wallets, action: FailedWalletRequestAction) {
  return { ...state, [action.id]: { ...state[action.id], error: action.error } };
}

function deleteWalletFromState(state: Wallets, action: DeleteWalletAction): Wallets {
  return _.omit(state, action.id);
}

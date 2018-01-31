// @flow
import type { Wallet } from './types.d';

export type WalletActions =
  | WalletClassActions
  | WalletInstanceActions;

export type WalletClassActions =
  | AddWalletAction
  | DeleteWalletAction;

export type AddWalletAction = {|
  type: 'ADD_WALLET',
  wallet: Wallet
|};

export type DeleteWalletAction = {|
  type: 'DELETE_WALLET',
  id: string
|};

export type WalletInstanceActions =
  | EditWalletAction;

export type EditWalletAction = {|
  type: 'EDIT_WALLET',
  id: string,
  wallet: Wallet
|};

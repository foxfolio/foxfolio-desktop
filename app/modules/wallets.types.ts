export interface Wallet {
  currency: string;
  address: string;
  quantity: number;
  note?: string;
}

export type WalletActions = WalletClassActions | WalletInstanceActions;

export type WalletClassActions = AddWalletAction | DeleteWalletAction;

export interface AddWalletAction {
  type: 'ADD_WALLET';
  wallet: Wallet;
}

export interface DeleteWalletAction {
  type: 'DELETE_WALLET';
  id: string;
}

export type WalletInstanceActions = EditWalletAction;

export interface EditWalletAction {
  type: 'EDIT_WALLET';
  id: string;
  wallet: Wallet;
}

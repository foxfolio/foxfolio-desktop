export interface Wallet {
  id: string;
  currency: string;
  quantity: number;
  note?: string;
}

export interface Wallets {
  [key: string]: Wallet;
}

export type WalletActions = AddWalletAction | EditWalletAction | DeleteWalletAction;

export interface AddWalletAction {
  type: 'ADD_WALLET';
  wallet: Wallet;
}

export interface EditWalletAction {
  type: 'EDIT_WALLET';
  id: string;
  updatedWallet: Wallet;
}
export interface DeleteWalletAction {
  type: 'DELETE_WALLET';
  id: string;
}

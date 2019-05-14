export interface Wallet {
  id: string;
  currency: string;
  quantity: number;
  address?: string;
  note?: string;
  error?: string;
}

export interface Wallets {
  [key: string]: Wallet;
}

export type WalletActions = AddWalletAction | EditWalletAction | DeleteWalletAction | FailedWalletRequestAction;

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

export interface FailedWalletRequestAction {
  type: 'FAILED_WALLET_REQUEST_ACTION',
  id: string;
  error: string;
}

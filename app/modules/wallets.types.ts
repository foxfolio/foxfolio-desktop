export interface Wallet {
  currency: string;
  address: string;
  quantity: number;
  note?: string;
}

export type WalletActions =
  | { type: 'ADD_WALLET'; wallet: Wallet }
  | { type: 'EDIT_WALLET'; wallet: Wallet; newWallet: Wallet }
  | { type: 'DELETE_WALLET'; wallet: Wallet };

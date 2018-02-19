export interface Portfolio {
  total: Balances;
  wallets: {
    [id: string]: number;
  };
  exchanges: {
    [id: string]: Balances;
  };
}

export interface Balances {
  [asset: string]: number;
}

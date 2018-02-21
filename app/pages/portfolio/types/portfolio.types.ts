export interface Portfolio {
  total: Balances;
  wallets: Balances;
  exchanges: ExchangeBalances;
}

export interface PortfolioSum {
  crypto: number;
  fiat: number;
}

export interface PortfolioChange {
  crypto: number;
  fiat: number;
}

export interface ExchangeBalances {
  [id: string]: Balances;
}

export interface Balances {
  [asset: string]: number;
}

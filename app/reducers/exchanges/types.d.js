// @flow
export type Exchanges = {
  [key: string]: Exchange
};

export type Exchange = {|
  id: string,
  type: string,
  credentials: ExchangeCredentials,
  balances: Balances,
  ledger: LedgerEntry[],
  trades: Trade[]
|};

export type ExchangeCredentials = {|
  apiKey: string,
  secret: string,
  uid?: string,
  login?: string,
  password?: string
|};

export type Balances = {
  [string]: number
};

export type Trade = {};

export type LedgerEntry = {};

// @flow
export type Portfolio = {
  total: {
    [string]: number
  },
  wallets: {
    [string]: number
  },
  exchanges: {
    [string]: Balances
  }
};

export type Balances = {
  [string]: number
};

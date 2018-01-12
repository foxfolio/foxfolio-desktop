// @flow
export type Coinlist = {
  [symbol: string]: CoinlistEntry
};

export type CoinlistEntry = {
  FullName: string,
  ImageUrl: string
};

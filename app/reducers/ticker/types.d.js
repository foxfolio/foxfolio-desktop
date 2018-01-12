// @flow
export type Ticker = {
  [fsym: string]: {
    [tsym: string]: TickerEntry
  }
};

export type TickerEntry = {
  CHANGEPCT24HOUR: number,
  PRICE: number
};

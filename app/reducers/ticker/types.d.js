// @flow
export type TickerAndHistory = {
  ticker: Ticker,
  history: {
    [fsym: string]: {
      [tsym: string]: {
        lastUpdate: Date,
        data: History
      }
    }
  }
};

export type Ticker = {
  [fsym: string]: {
    [tsym: string]: TickerEntry
  }
};

export type TickerEntry = {
  CHANGEPCT24HOUR: number,
  PRICE: number
};

export type History = [{ close: number }];

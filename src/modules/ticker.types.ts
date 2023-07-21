export type TickerActions =
  | { type: 'LAST_UPDATED'; key: string; time: Date }
  | { type: 'TICKER_UPDATE'; ticker: Ticker };

export interface Ticker {
  [fsym: string]: TickerForSymbol | undefined;
}

export interface TickerForSymbol {
  [tsym: string]: TickerEntry | undefined;
}

export interface TickerEntry {
  CHANGEPCT24HOUR: number;
  PRICE: number;
}


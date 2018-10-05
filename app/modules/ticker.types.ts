export interface TickerAndHistory {
  ticker: Ticker;
  history: History;
  pricesForTime: PricesForTime;
}

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

export interface History {
  [fsym: string]:
    | {
        [tsym: string]: HistoryEntry | undefined;
      }
    | undefined;
}
export interface HistoryEntry {
  lastUpdate: Date;
  data: HistoryData;
}
export type HistoryData = Array<{ close: number; time: number }>;

export interface PricesForTime {
  [fsym: string]:
    | {
        [tsym: string]:
          | {
              [timestamp: number]: number | undefined;
            }
          | undefined;
      }
    | undefined;
}

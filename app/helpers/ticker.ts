import { History, HistoryEntry, PricesForTime, Ticker, TickerEntry } from '../reducers/ticker';

export interface TickerEntries {
  [symbol: string]: TickerEntry;
}

export const getTickerEntries = (ticker: Ticker, fsym: string, tsyms: string[]): TickerEntries =>
  tsyms.reduce(
    (acc, tsym) => ({
      ...acc,
      [tsym]: getTickerEntry(ticker, fsym, tsym),
    }),
    {}
  );

export const getTickerEntry = (ticker: Ticker, fsym: string, tsym: string): TickerEntry => {
  if (fsym !== tsym) {
    const tickerEntry = getNestedEntry(ticker, fsym, tsym);
    if (tickerEntry != null && tickerEntry.PRICE && tickerEntry.CHANGEPCT24HOUR) {
      return tickerEntry;
    }

    return {
      PRICE: 0,
      CHANGEPCT24HOUR: 0,
    };
  }
  return { PRICE: 1, CHANGEPCT24HOUR: 0 };
};

export const getHistoryEntry = (history: History, fsym: string, tsym: string): HistoryEntry => {
  const historyEntry = getNestedEntry(history, fsym, tsym);
  if (historyEntry != null && historyEntry.lastUpdate && historyEntry.data) {
    return historyEntry;
  }
  return {
    lastUpdate: new Date(0),
    data: [],
  };
};

export const getPriceForTime = (
  pricesForTime: PricesForTime,
  fsym: string,
  tsym: string,
  timestamp: number
): number => {
  if (fsym === tsym) {
    return 1;
  }
  const timestampInSec = Math.floor(timestamp / 1000);
  const pricesForPair = getNestedEntry(pricesForTime, fsym, tsym);
  if (pricesForPair != null) {
    const priceAtTimestamp = pricesForPair[timestampInSec];
    if (priceAtTimestamp && priceAtTimestamp > 0) {
      return priceAtTimestamp;
    }
  }
  return 0;
};

const getNestedEntry = <T>(
  collection: { [id: string]: { [id: string]: T | undefined } | undefined },
  outerKey: string,
  innerKey: string
): T | undefined => {
  if (collection) {
    const firstLevel = collection[outerKey];
    if (firstLevel != null) {
      const innerLevel = firstLevel[innerKey];
      if (innerLevel != null) {
        return innerLevel;
      }
    }
  }
  return undefined;
};

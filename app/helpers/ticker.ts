import { Ticker, TickerEntry } from '../reducers/ticker';

export const getTickerEntry = (ticker: Ticker, fsym: string, tsym: string): TickerEntry => {
  if (fsym !== tsym) {
    if (ticker) {
      const tickerForSymbol = ticker[fsym];
      if (tickerForSymbol != null) {
        const tickerEntry = tickerForSymbol[tsym];
        if (tickerEntry != null && tickerEntry.PRICE && tickerEntry.CHANGEPCT24HOUR) {
          return tickerEntry;
        }
      }
    }
    console.log(`Couldn't get ticker entry for ${fsym}/${tsym}`);
    return {
      PRICE: 0,
      CHANGEPCT24HOUR: 0,
    };
  } else {
    return { PRICE: 1, CHANGEPCT24HOUR: 0 };
  }
};

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

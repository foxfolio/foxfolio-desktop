import { Ticker, TickerEntry } from '../reducers/ticker';

export const getTickerEntry = (ticker: Ticker, fsym: string, tsym: string): TickerEntry => {
  if (fsym !== tsym) {
    if (ticker) {
      const tickerBase = ticker[fsym];
      if (tickerBase != null) {
        const tickerEntry = tickerBase[tsym];
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

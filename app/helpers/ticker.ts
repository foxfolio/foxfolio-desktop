import { Ticker } from '../reducers/ticker';

export const getTickerPrice = (ticker: Ticker, fsym: string, tsym: string) => {
  if (fsym !== tsym) {
    return ticker && ticker[fsym] && ticker[fsym][tsym] ? ticker[fsym][tsym].PRICE : 0;
  } else {
    return 1;
  }
};

import R from 'ramda';
import { Exchanges, Trade } from '../reducers/exchanges.types';
import { Ticker } from '../reducers/ticker';

export const mapKeys = R.curry((fn: any, obj: object) =>
  R.zipObj(R.map(fn, R.keys(obj)), R.values(obj))
);

export const flattenTransactions: (exchanges: Exchanges) => Trade[] = exchanges =>
  R.pipe(
    R.values,
    R.map(exchange => exchange.trades),
    R.reduce((acc, elem) => R.concat(acc, elem), [])
  )(exchanges);

export function unifySymbols(symbol: string): string {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    default:
      return symbol;
  }
}

export function getTickerPrice(ticker: Ticker, fsym: string, tsym: string): number {
  return fsym !== tsym ? ticker[fsym][tsym].PRICE : 1;
}

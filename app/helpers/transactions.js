// @flow
import R from 'ramda';
import type { Exchanges, Trade } from '../reducers/exchanges/types.d';

export const mapKeys = R.curry((fn: Function, obj: Object) => R.zipObj(R.map(fn, R.keys(obj)), R.values(obj)));

export function flattenTransactions(exchanges: Exchanges): Trade[] {
  return Object
    .keys(exchanges)
    .reduce((acc, id) => acc.concat(exchanges[id].trades), []);
}

export function unifySymbols(symbol: string): string {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    default:
      return symbol;
  }
}

export function getTickerPrice(ticker: Object, fsym: string, tsym: string): number {
  return fsym !== tsym ? ticker[fsym][tsym].PRICE : 1;
}

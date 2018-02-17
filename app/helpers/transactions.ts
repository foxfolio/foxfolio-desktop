import R from 'ramda';
import { Exchanges, Trade } from '../reducers/exchanges/types.d';
import { Ticker } from 'reducers/ticker';

export const mapKeys = R.curry((fn: any, obj: Object) => R.zipObj(R.map(fn, R.keys(obj)), R.values(obj)));

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

export function getTickerPrice(ticker: Ticker, fsym: string, tsym: string): number {
  return fsym !== tsym ? parseFloat(ticker[fsym][tsym].PRICE) : 1;
}

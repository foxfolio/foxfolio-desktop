import * as _ from 'lodash';
import { Exchanges, Trade } from '../reducers/exchanges.types';
import { Ticker } from '../reducers/ticker';

export const flattenTransactions: (exchanges: Exchanges) => Trade[] = exchanges =>
  _.chain(exchanges)
    .values()
    .map(exchange => exchange.trades)
    .reduce((acc, elem) => _.concat(acc, elem), [] as Trade[])
    .value();

export function getTickerPrice(ticker: Ticker, fsym: string, tsym: string): number {
  return fsym !== tsym ? ticker[fsym][tsym].PRICE : 1;
}

import { Trade } from './exchanges.types';

export interface TradesMap {
  [id: string]: Trade;
}
export interface TickerRequest {
  fsym: string;
  tsym: string;
  timestamp: number;
}

export type TradeActions =
  | { type: 'ADD_TRADE'; trade: Trade }
  | { type: 'UPDATE_TRADE'; id: string; trade: Trade }
  | { type: 'DELETE_TRADE'; id: string };

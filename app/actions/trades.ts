import { getPriceForTime } from '../helpers/ticker';
import { Trade } from '../reducers/exchanges.types';
import { Action, Dispatch, GetState, ThunkAction } from './actions.types';

export interface TickerRequest {
  fsym: string;
  tsym: string;
  timestamp: number;
}

export type TradeActions =
  | { type: 'ADD_TRADE'; trade: Trade }
  | { type: 'UPDATE_TRADE'; id: string; trade: Trade }
  | { type: 'DELETE_TRADE'; id: string }
  | {
      type: 'RECEIVE_PRICE_FOR_TIME';
      fsym: string;
      tsym: string;
      timestamp: number;
      price: number;
    };

function receivePriceForTime(fsym: string, tsym: string, timestamp: number, price: number): Action {
  return {
    type: 'RECEIVE_PRICE_FOR_TIME',
    fsym,
    tsym,
    timestamp,
    price,
  };
}

export function addTrade(trade: Trade): Action {
  return {
    type: 'ADD_TRADE',
    trade,
  };
}

export function updateTrade(id: string, trade: Trade): Action {
  return {
    type: 'UPDATE_TRADE',
    id,
    trade,
  };
}

export function deleteTrade(id: string): Action {
  return {
    type: 'DELETE_TRADE',
    id,
  };
}

export function requestTicker(requests: TickerRequest[]): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    const pricesForTime = getState().ticker.pricesForTime;
    for (const request of requests) {
      const timestampInSec = Math.floor(request.timestamp / 1000);
      if (getPriceForTime(pricesForTime, request.fsym, request.tsym, request.timestamp) > 0) {
        continue;
      }
      const histoPrice = await fetch(
        `https://min-api.cryptocompare.com/data/pricehistorical?ts=${timestampInSec}&fsym=${
          request.fsym
        }&tsyms=${request.tsym}`
      ).then(result => result.json());
      dispatch(
        receivePriceForTime(
          request.fsym,
          request.tsym,
          timestampInSec,
          histoPrice[request.fsym][request.tsym]
        )
      );
    }
  };
}

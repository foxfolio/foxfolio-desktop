import { Action, Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { getPriceForTime } from '../helpers/ticker';
import { getPrices } from '../selectors/selectGlobalState';
import { Prices } from './prices.types';
import { TickerRequest } from './trades.types';

// Reducer
export default function reducer(state: Prices = {}, action: Action): Prices {
  switch (action.type) {
    case 'RECEIVE_PRICE_FOR_TIME':
      const pricesForSymbol = state[action.fsym];
      return {
        ...state,
        [action.fsym]: {
          ...(state ? state[action.fsym] : {}),
          [action.tsym]: {
            ...(pricesForSymbol ? pricesForSymbol[action.tsym] : {}),
            [action.timestamp]: action.price,
          },
        },
      };
    default:
      return state;
  }
}

// Action Creators
export function requestPrice(requests: TickerRequest[]): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    const pricesForTime = getPrices(getState());
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

export function receivePriceForTime(
  fsym: string,
  tsym: string,
  timestamp: number,
  price: number
): Action {
  return {
    type: 'RECEIVE_PRICE_FOR_TIME',
    fsym,
    tsym,
    timestamp,
    price,
  };
}

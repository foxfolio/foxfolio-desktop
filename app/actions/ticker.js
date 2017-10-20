// @flow
import type { Action, Dispatch, ThunkAction } from './types';

const REFRESH_TIME_IN_MS = 10000;

function receiveTickerUpdate(ticker: Object[]): Action {
  return {
    type: 'TICKER_UPDATE',
    ticker,
  };
}

export function requestTickerUpdate(): ThunkAction {
  return (dispatch: Dispatch) => {
    fetch('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=100')
      .then(result => result.json())
      .then(result => dispatch(receiveTickerUpdate(result)))
      .catch(error => console.error(error));
  };
}

export function continuouslyUpdateTicker() {
  return (dispatch: Dispatch) => {
    setInterval(() => dispatch(requestTickerUpdate()), REFRESH_TIME_IN_MS);
  };
}

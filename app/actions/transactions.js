import getBittrexTransactions from './bittrex';
import getBitstampTransactions from './bitstamp';
import type { sourceType } from '../reducers/sources';
import type { Trade, Transfer } from '../reducers/transactions';

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS';
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS';

function requestTransactions(source): RequestAction {
  return {
    type: REQUEST_TRANSACTIONS,
    source,
  };
}

export function receiveTransactions(exchange: string, trades: Trade[] = [], transfers: Transfer[] = []): ReceiveAction {
  return {
    type: RECEIVE_TRANSACTIONS,
    exchange,
    trades,
    transfers,
  };
}

function getConfiguredSources(state) {
  return state.sources;
}

function fetchTransactions(source) {
  return dispatch => {
    dispatch(requestTransactions(source));
    switch (source.name) {
      case 'bittrex':
        return dispatch(getBittrexTransactions(source));
      case 'bitstamp':
        return dispatch(getBitstampTransactions(source));
      default:
        return dispatch(receiveTransactions(source));
    }
  };
}

export function fetchAllTransactions() {
  return (dispatch, getState) => {
    const sources = getConfiguredSources(getState());
    return sources.map(source => dispatch(fetchTransactions(source)));
  };
}

export type Action =
  | { type: string }
  | RequestAction
  | ReceiveAction;

export type RequestAction = {
  type: 'REQUEST_TRANSACTIONS',
  source: sourceType
};
export type ReceiveAction = {
  type: 'RECEIVE_TRANSACTIONS',
  exchange: string,
  trades: Trade[],
  transfers: Transfer[]
};

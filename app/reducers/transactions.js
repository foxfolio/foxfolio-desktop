// @flow
import R from 'ramda';
import type { Action } from '../actions/types';

const initialSourceState = {
  isFetching: false,
  didInvalidate: false,
  trades: [],
  transfers: [],
};

const initialState = {
  bittrex: initialSourceState,
  bitstamp: initialSourceState,
};

export default function transactions(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'REQUEST_TRANSACTIONS':
      return {
        ...state,
        [action.source.name]: {
          ...state[action.source.name],
          isFetching: true,
        },
      };
    case 'RECEIVE_TRANSACTIONS':
      return {
        ...state,
        [action.exchange]: {
          isFetching: false,
          didInvalidate: false,
          lastUpdated: Date.now().valueOf(),
          trades: unionTransactions(state[action.exchange].trades, action.trades),
          transfers: unionTransactions(state[action.exchange].transfers, action.transfers),
        },
      };
    case 'FAILED_TRANSACTION':
      return {
        ...state,
        [action.exchange]: {
          ...state[action.exchange],
          isFetching: false,
          didInvalidate: false,
          lastUpdated: Date.now().valueOf(),
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export type Transaction = Trade | Transfer;

export type Trade = {|
  id: string,
  source: string,
  date: Date,
  market: {
    major: string,
    minor: string
  },
  type: 'BUY' | 'SELL',
  amount: number,
  rate: number,
  commission: number
|};

export type Transfer = {|
  id: string,
  source: string,
  date: Date,
  currency: string,
  type: 'DEPOSIT' | 'WITHDRAW',
  amount: number
|};

export type State = {
  bittrex: SourceState,
  bitstamp: SourceState
};

type SourceState = {
  isFetching: boolean,
  didInvalidate: boolean,
  trades: Trade[],
  transfers: Transfer[]
};

function unionTransactions(existingTransactions, newTransactions) {
  return R.unionWith(R.eqBy(R.prop('id')), existingTransactions, newTransactions);
}

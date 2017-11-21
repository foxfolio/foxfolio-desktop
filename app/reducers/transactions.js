// @flow
import R from 'ramda';
import type { Action } from '../actions/action.d';
import type { Trade, Transaction, Transfer } from '../actions/transaction.d';

export type TransactionsState = {
  [string]: TransactionState
};

export type TransactionState = {|
  openRequests: number,
  lastUpdated: Date,
  trades: Trade[],
  transfers: Transfer[]
|};

const initialSourceState = {
  openRequests: 0,
  lastUpdated: new Date(),
  trades: [],
  transfers: [],
};

// TODO More flexible state, not just one key per exchange type
const initialState = {
  bittrex: initialSourceState,
  bitstamp: initialSourceState,
  kraken: initialSourceState,
};

export default function transactions(state: TransactionsState = initialState, action: Action): TransactionsState {
  switch (action.type) {
    case 'REQUEST_TRANSACTIONS':
      return {
        ...state,
        [action.source.id]: {
          ...state[action.source.id],
          openRequests: state[action.source.id].openRequests + 1,
        },
      };
    case 'RECEIVE_TRANSACTIONS':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: Date.now().valueOf(),
          trades: mergeTransactions(state[action.exchange.id].trades, action.trades),
          transfers: mergeTransactions(state[action.exchange.id].transfers, action.transfers),
        },
      };
    case 'RECEIVE_TRANSFERS':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: Date.now().valueOf(),
          transfers: mergeTransactions(state[action.exchange.id].transfers, action.transfers),
        },
      };
    case 'RECEIVE_TRADES':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: Date.now().valueOf(),
          trades: mergeTransactions(state[action.exchange.id].trades, action.trades),
        },
      };
    case 'FAILED_REQUEST':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: Date.now().valueOf(),
          error: action.error,
        },
      };
    default:
      return state;
  }
}

function mergeTransactions<T: Transaction>(existingTransactions: T[], newTransactions: T[]) {
  return R.unionWith(R.eqBy(R.prop('id')), existingTransactions, newTransactions);
}

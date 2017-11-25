// @flow
import R from 'ramda';
import type { Action } from '../actions/action.d';
import type { Trade, Transaction, Transfer } from '../actions/transaction.d';

export type TransactionsState = {
  [string]: TransactionState
};

export type TransactionState = {|
  openRequests: number,
  lastUpdated?: Date,
  trades: Trade[],
  transfers: Transfer[]
|};

const emptyExchangeState = {
  openRequests: 0,
  trades: [],
  transfers: [],
};

export default function transactions(state: TransactionsState = {}, action: Action): TransactionsState {
  switch (action.type) {
    case 'REQUEST_TRANSACTIONS':
      return {
        ...state,
        [action.source.id]: {
          ...(state[action.source.id] ? state[action.source.id] : emptyExchangeState),
          openRequests: state[action.source.id] ? state[action.source.id].openRequests + 1 : 1,
        },
      };
    case 'RECEIVE_TRANSACTIONS':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          error: undefined,
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: new Date(),
          trades: mergeTransactions(state[action.exchange.id].trades, action.trades),
          transfers: mergeTransactions(state[action.exchange.id].transfers, action.transfers),
        },
      };
    case 'RECEIVE_TRANSFERS':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          error: undefined,
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: new Date(),
          transfers: mergeTransactions(state[action.exchange.id].transfers, action.transfers),
        },
      };
    case 'RECEIVE_TRADES':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          error: undefined,
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: new Date(),
          trades: mergeTransactions(state[action.exchange.id].trades, action.trades),
        },
      };
    case 'FAILED_TRANSACTION_REQUEST':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: state[action.exchange.id].openRequests - 1,
          lastUpdated: new Date(),
          error: action.error,
        },
      };
    case 'DELETE_EXCHANGE':
      return R.omit([action.exchange.id], state);
    default:
      return state;
  }
}

function mergeTransactions<T: Transaction>(existingTransactions: T[], newTransactions: T[]): T[] {
  return R.unionWith(R.eqBy(R.prop('id')), existingTransactions, newTransactions);
}

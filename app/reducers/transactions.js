// @flow
import R from 'ramda';
import type { Action } from '../actions/action.d';
import type { Trade, Transaction, Transfer } from '../actions/transaction.d';
import type { Balances } from '../types/portfolio.d.ts';

export type TransactionsState = {
  [string]: TransactionState
};

export type TransactionState = {|
  openRequests: {
    balances: number,
    transactions: number
  },
  lastUpdated?: Date,
  balances: Balances,
  trades: Trade[],
  transfers: Transfer[]
|};

const emptyExchangeState: TransactionState = {
  openRequests: {
    balances: 0,
    transactions: 0,
  },
  balances: {},
  trades: [],
  transfers: [],
};

export default function transactions(state: TransactionsState = {}, action: Action): TransactionsState {
  switch (action.type) {
    case 'REQUEST_BALANCES':
      return {
        ...state,
        [action.source.id]: {
          ...(state[action.source.id] ? state[action.source.id] : emptyExchangeState),
          openRequests: {
            ...(state[action.source.id] ? state[action.source.id].openRequests : { transactions: 0 }),
            balances: state[action.source.id] ? state[action.source.id].openRequests.balances + 1 : 1,
          },
        },
      };
    case 'REQUEST_TRANSACTIONS':
      return {
        ...state,
        [action.source.id]: {
          ...(state[action.source.id] ? state[action.source.id] : emptyExchangeState),
          openRequests: {
            ...(state[action.source.id] ? state[action.source.id].openRequests : { balances: 0 }),
            transactions: state[action.source.id] ? state[action.source.id].openRequests.transactions + 1 : 1,
          },
        },
      };
    case 'RECEIVE_BALANCES':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: {
            ...state[action.exchange.id].openRequests,
            balances: state[action.exchange.id].openRequests.balances - 1,
          },
          balances: action.balances,
        },
      };
    case 'RECEIVE_TRANSACTIONS':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          error: undefined,
          openRequests: {
            ...state[action.exchange.id].openRequests,
            transactions: state[action.exchange.id].openRequests.transactions - 1,
          },
          lastUpdated: new Date(),
          trades: mergeTransactions(state[action.exchange.id].trades, action.trades),
          transfers: mergeTransactions(state[action.exchange.id].transfers, action.transfers),
        },
      };
    case 'FAILED_BALANCES':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: {
            ...state[action.exchange.id].openRequests,
            balances: state[action.exchange.id].openRequests.balances - 1,
          },
          lastUpdated: new Date(),
          error: action.error,
        },
      };
    case 'FAILED_TRANSACTIONS':
      return {
        ...state,
        [action.exchange.id]: {
          ...state[action.exchange.id],
          openRequests: {
            ...state[action.exchange.id].openRequests,
            transactions: state[action.exchange.id].openRequests.transactions - 1,
          },
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

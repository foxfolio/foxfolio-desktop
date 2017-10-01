import R from 'ramda';
import { RECEIVE_TRANSACTIONS, REQUEST_TRANSACTIONS } from '../actions/transactions';

export type transactionType = {
  date: Date,
  type: 'deposit' | 'withdraw' | 'trade',
  source: string,
  outgoing?: string,
  incoming?: string,
  quantityIncoming?: number,
  quantityOutgoing?: number,
  rate?: number
};

type actionType = {
  +type: string,
  transactions: any
};

export default function transactions(state = {
  bittrex: {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
  bitstamp: {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
}, action: actionType) {
  switch (action.type) {
    case REQUEST_TRANSACTIONS:
      return {
        ...state,
        [action.source.name]: {
          ...state[action.source.name],
          isFetching: true,
        },
      };
    case RECEIVE_TRANSACTIONS:
      return {
        ...state,
        [action.exchange]: {
          isFetching: false,
          didInvalidate: false,
          lastUpdated: Date.now().valueOf(),
          items: unionTransactions(state[action.exchange].items, action.transactions),
        },
      };
    default:
      return state;
  }
}

function unionTransactions(existingTransactions, newTransactions) {
  return R.unionWith(R.eqBy(R.prop('id')), existingTransactions, newTransactions);
}

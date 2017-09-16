import { RECEIVE_TRANSACTIONS, REQUEST_TRANSACTIONS } from '../actions/transactions';

type actionType = {
  +type: string,
  transactions: any
};

export default function bittrex(state = {
  isFetching: false,
  didInvalidate: false,
  items: [],
}, action: actionType) {
  switch (action.type) {
    case REQUEST_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case RECEIVE_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now().valueOf(),
        items: action.transactions,
      });
    default:
      return state;
  }
}

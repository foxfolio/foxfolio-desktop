import { SET_TRANSACTIONS } from '../actions/bittrex';

type actionType = {
  +type: string,
  transactions: any
};

export default function bittrex(state = [], action: actionType) {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return action.transactions;
    default:
      return state;
  }
}

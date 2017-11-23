// @flow
import R from 'ramda';
import type { Action } from '../actions/action.d';
import type { Exchange } from '../actions/exchange.d';

export default function sources(state: Exchange[] = [], action: Action) {
  switch (action.type) {
    case 'ADD_SOURCE':
      return [...state, action.source];
    case 'EDIT_SOURCE':
      return [
        ...R.reject(R.equals(action.source), state),
        action.newSource.transactionFile ? R.omit(['transactionFile'], action.newSource) : action.newSource,
      ];
    case 'DELETE_EXCHANGE':
      return R.reject(R.equals(action.exchange), state);
    default:
      return state;
  }
}

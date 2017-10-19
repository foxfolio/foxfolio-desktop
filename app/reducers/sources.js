// @flow
import R from 'ramda';
import type { Action } from '../actions/types';

export type sourceType = {
  name: string,
  apiKey: string,
  apiSecret: string,
  customerId?: string,
  transactionFile?: string
};

export default function sources(state: sourceType[] = [], action: Action) {
  switch (action.type) {
    case 'ADD_SOURCE':
      return [...state, action.source];
    case 'EDIT_SOURCE':
      return [...R.reject(R.equals(action.source), state), R.omit(['transactionFile'], action.newSource)];
    default:
      return state;
  }
}

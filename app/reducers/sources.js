// @flow
import R from 'ramda';
import type { Action } from '../actions/sources';
import { ADD_SOURCE, EDIT_SOURCE } from '../actions/sources';

export type sourceType = {
  name: string,
  apiKey: string,
  apiSecret: string,
  customerId?: string
};

const initialState: sourceType[] = [];

export default function sources(state: sourceType[] = initialState, action: Action) {
  switch (action.type) {
    case ADD_SOURCE:
      return [...state, action.source];
    case EDIT_SOURCE:
      return [...R.reject(R.equals(action.oldSource), state), action.newSource];
    default:
      return state;
  }
}

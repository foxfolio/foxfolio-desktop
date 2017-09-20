// @flow
import { ADD_SOURCE } from '../actions/sources';

const initialState = [
  {
    name: 'bittrex',
    apiKey: '',
    apiSecret: '',
  },
];

export type sourceType = {
  name: string,
  apiKey: string,
  apiSecret: string
};

type actionType = {
  +type: string,
  source: any
};

export default function sources(state: [sourceType] = initialState, action: actionType) {
  switch (action.type) {
    case ADD_SOURCE:
      return [...state, action.source];
    default:
      return state;
  }
}

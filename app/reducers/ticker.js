// @flow
import type { Action } from '../actions/action.d';

export default function ticker(state: Object = {}, action: Action) {
  switch (action.type) {
    case 'TICKER_UPDATE':
      return action.ticker;
    default:
      return state;
  }
}

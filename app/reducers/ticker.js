// @flow
import R from 'ramda';
import type { Action } from '../actions/types';

export default function ticker(state: Object = {}, action: Action) {
  switch (action.type) {
    case 'TICKER_UPDATE':
      return R.reduce((acc, value) => ({ ...acc, [value.symbol]: value }), {}, action.ticker);
    default:
      return state;
  }
}

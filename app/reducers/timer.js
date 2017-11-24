// @flow

import type { Action } from '../actions/action.d';

type State = {
  [string]: number,
  lastUpdated?: {
    [string]: Date
  }
};

export default function timer(state: $ReadOnly<State> = {}, action: Action) {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        [action.name]: action.timer,
      };
    case 'LAST_UPDATED':
      return {
        ...state,
        lastUpdated: {
          ...state.lastUpdated,
          [action.key]: action.time,
        },
      };
    default:
      return state;
  }
}

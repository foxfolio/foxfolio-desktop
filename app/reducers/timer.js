// @flow

import type { Action } from '../actions/action.d';

export type Timer = {
  [string]: number,
  lastUpdated?: {
    [string]: Date
  }
};

export default function timer(state: Timer = {}, action: Action): Timer {
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

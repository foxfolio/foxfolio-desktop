// @flow

import type { Action } from '../actions/types';

export default function timer(state: Object = {}, action: Action) {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        [action.name]: action.timer,
      };
    default:
      return state;
  }
}

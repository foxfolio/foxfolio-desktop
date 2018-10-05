import { Action } from '../actions/actions.types';
import { Timers } from './timer.types';

// Reducer
export default function reducer(state: Timers = { timers: {} }, action: Action): Timers {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        timers: {
          ...state.timers,
          [action.name]: action.timer,
        },
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

// Action Creators
export function setLastUpdate(key: string): Action {
  return {
    type: 'LAST_UPDATED',
    key,
    time: new Date(),
  };
}

export function startTimer(name: string, timer: number): Action {
  return {
    type: 'START_TIMER',
    name,
    timer,
  };
}

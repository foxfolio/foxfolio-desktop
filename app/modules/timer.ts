import { Action } from '../actions/actions.types';

export interface Timers {
  timers: {
    [index: string]: number;
  };
  lastUpdated?: {
    [index: string]: Date;
  };
}

export default function timer(state: Timers = { timers: {} }, action: Action): Timers {
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

// @flow
import type { Action } from './action.d';

export default function startTimer(name: string, timer: IntervalID): Action {
  return {
    type: 'START_TIMER',
    name,
    timer,
  };
}

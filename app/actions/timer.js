// @flow
import type { Action } from './actions.types';

export default function startTimer(name: string, timer: IntervalID): Action {
  return {
    type: 'START_TIMER',
    name,
    timer,
  };
}

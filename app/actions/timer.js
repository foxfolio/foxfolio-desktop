// @flow

import type { Action } from './types';

export default function startTimer(name: string, timer: any): Action {
  return {
    type: 'START_TIMER',
    name,
    timer,
  };
}

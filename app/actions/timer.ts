import { Action } from './actions.types';

export default function startTimer(name: string, timer: number): Action {
  return {
    type: 'START_TIMER',
    name,
    timer,
  };
}

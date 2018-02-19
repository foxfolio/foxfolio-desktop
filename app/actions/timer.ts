import { Action } from './actions.types';
import Timer = NodeJS.Timer;

export default function startTimer(name: string, timer: Timer): Action {
  return {
    type: 'START_TIMER',
    name,
    timer,
  };
}

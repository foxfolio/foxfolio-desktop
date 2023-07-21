export interface TimerActions {
  type: 'START_TIMER';
  name: string;
  timer: number;
}

export interface Timers {
  timers: {
    [index: string]: number;
  };
  lastUpdated?: {
    [index: string]: Date;
  };
}

export interface HistoryActions {
  type: 'HISTORY_UPDATE';
  fsym: string;
  tsym: string;
  history: HistoryData;
}

export interface History {
  [fsym: string]:
    | {
        [tsym: string]: HistoryEntry | undefined;
      }
    | undefined;
}

export interface HistoryEntry {
  lastUpdate: Date;
  data: HistoryData;
}

export type HistoryData = Array<{ close: number; time: number }>;

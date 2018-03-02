import { Action } from '../actions/actions.types';

export interface TickerAndHistory {
  ticker: Ticker;
  history: History;
  pricesForTime: PricesForTime;
}

export interface Ticker {
  [fsym: string]: {
    [tsym: string]: TickerEntry;
  };
}

export interface TickerEntry {
  CHANGEPCT24HOUR: number;
  PRICE: number;
}

export interface History {
  [fsym: string]: {
    [tsym: string]: {
      lastUpdate: Date;
      data: HistoryEntry;
    };
  };
}

export interface PricesForTime {
  [fsym: string]: {
    [tsym: string]: {
      [timestamp: number]: number;
    };
  };
}

export type HistoryEntry = Array<{ close: number; time: number }>;

export function ticker(
  state: TickerAndHistory = { ticker: {}, history: {}, pricesForTime: {} },
  action: Action
): TickerAndHistory {
  switch (action.type) {
    case 'TICKER_UPDATE':
      return { ...state, ticker: action.ticker };
    case 'HISTORY_UPDATE':
      return {
        ...state,
        history: {
          ...state.history,
          [action.fsym]: {
            ...state.history[action.fsym],
            [action.tsym]: {
              lastUpdate: new Date(),
              data: action.history.filter((val, i) => i % 5 === 0),
            },
          },
        },
      };
    case 'RECEIVE_PRICE_FOR_TIME':
      return {
        ...state,
        pricesForTime: {
          ...state.pricesForTime,
          [action.fsym]: {
            ...state.pricesForTime[action.fsym],
            [action.tsym]: {
              ...state.pricesForTime[action.fsym][action.tsym],
              [action.timestamp]: action.price,
            },
          },
        },
      };
    default:
      return state;
  }
}

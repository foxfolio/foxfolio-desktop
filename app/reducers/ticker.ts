import { Action } from '../actions/actions.types';

export interface TickerAndHistory {
  ticker: Ticker;
  history: History;
  pricesForTime: PricesForTime;
}

export interface Ticker {
  [fsym: string]: TickerForSymbol | undefined;
}

export interface TickerForSymbol {
  [tsym: string]: TickerEntry | undefined;
}

export interface TickerEntry {
  CHANGEPCT24HOUR: number;
  PRICE: number;
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

export interface PricesForTime {
  [fsym: string]:
    | {
        [tsym: string]:
          | {
              [timestamp: number]: number | undefined;
            }
          | undefined;
      }
    | undefined;
}

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
      const pricesForSymbol = state.pricesForTime[action.fsym];
      return {
        ...state,
        pricesForTime: {
          ...state.pricesForTime,
          [action.fsym]: {
            ...(state.pricesForTime ? state.pricesForTime[action.fsym] : {}),
            [action.tsym]: {
              ...(pricesForSymbol ? pricesForSymbol[action.tsym] : {}),
              [action.timestamp]: action.price,
            },
          },
        },
      };
    default:
      return state;
  }
}

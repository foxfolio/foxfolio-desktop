// @flow
import { Action } from 'actions/action.d';

export interface TickerAndHistory {
  ticker: Ticker,
  history: History
}

export interface Ticker {
  [fsym: string]: {
    [tsym: string]: TickerEntry
  }
}

export interface TickerEntry {
  CHANGEPCT24HOUR: number,
  PRICE: string
}

export interface History {
  [fsym: string]: {
    [tsym: string]: {
      lastUpdate: Date,
      data: HistoryEntry
    }
  }
}

export type HistoryEntry = [{ close: number }];

export function ticker(state: TickerAndHistory = {ticker: {}, history: {}}, action: Action): TickerAndHistory {
  switch (action.type) {
    case 'TICKER_UPDATE':
      return {...state, ticker: action.ticker};
    case 'HISTORY_UPDATE':
      return {
        ...state,
        history: {
          ...state.history,
          [action.fsym]: {
            ...state.history[action.fsym],
            [action.tsym]: {lastUpdate: new Date(), data: action.history.filter((val, i) => i % 5 === 0)},
          },
        },
      };
    default:
      return state;
  }
}

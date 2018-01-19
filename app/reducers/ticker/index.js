// @flow
import type { Action } from '../../actions/action.d';
import type { Ticker } from './types.d';

export function ticker(state: Ticker = { ticker: {}, history: {} }, action: Action) {
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
            [action.tsym]: { lastUpdate: new Date(), data: action.history.filter((val, i) => i % 5 === 0) },
          },
        },
      };
    default:
      return state;
  }
}

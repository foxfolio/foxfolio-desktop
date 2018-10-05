import { Action } from '../actions/actions.types';
import { TickerAndHistory } from './ticker.types';

export default function reducer(
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

import dayjs from 'dayjs';
import { Action, Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { getHistoryEntry } from '../helpers/ticker';
import { getHistory } from '../selectors/selectGlobalState';
import { History, HistoryData } from './history.types';

// Reducer
export default function reducer(state: History = {}, action: Action): History {
  switch (action.type) {
    case 'HISTORY_UPDATE':
      return {
        ...state,
        [action.fsym]: {
          ...state[action.fsym],
          [action.tsym]: {
            lastUpdate: new Date(),
            data: action.history.filter((val, i) => i % 5 === 0),
          },
        },
      };
    default:
      return state;
  }
}

// Action Creators
export const requestHistoryForAll = (
  fsyms: string[],
  tsym: string,
  forceRequest: boolean = false
) => (dispatch: Dispatch) =>
  fsyms.forEach(fsym => dispatch(requestHistory(fsym, tsym, forceRequest)));

export function requestHistory(
  fsym: string,
  tsym: string,
  forceRequest: boolean = false
): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const twoMinutesAgo = dayjs().subtract(2, 'minute');
    if (
      forceRequest ||
      !(getHistoryEntry(getHistory(getState()), fsym, tsym).lastUpdate >= twoMinutesAgo.toDate())
    ) {
      fetch(`https://min-api.cryptocompare.com/data/histominute?fsym=${fsym}&tsym=${tsym}`)
        .then(result => result.json())
        .then(result => dispatch(receiveHistory(fsym, tsym, result.Data)))
        .catch(error => console.error(error));
    }
  };
}

function receiveHistory(fsym: string, tsym: string, history: HistoryData): Action {
  return {
    type: 'HISTORY_UPDATE',
    fsym,
    tsym,
    history,
  };
}

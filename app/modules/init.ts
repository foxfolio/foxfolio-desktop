import { Dispatch, ThunkAction } from '../actions/actions.types';
import { fetchAllBalances } from './exchanges';
import { requestTickerUpdate } from './ticker';

export function rehydrationComplete(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate());
    dispatch(fetchAllBalances());
  };
}

// @flow
import type { Dispatch, ThunkAction } from './action.d';
import { requestTickerUpdate } from './ticker';
import { fetchAllBalances } from './transactions';

export default function rehydrationComplete(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate());
    dispatch(fetchAllBalances());
  };
}

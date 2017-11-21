// @flow
import type { Dispatch, ThunkAction } from './action.d';
import { requestTickerUpdate } from './ticker';
import { fetchAllTransactions } from './transactions';

export default function rehydrationComplete(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate());
    dispatch(fetchAllTransactions());
  };
}

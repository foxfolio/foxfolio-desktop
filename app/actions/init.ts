import { Dispatch, ThunkAction } from './actions.types';
import { requestTickerUpdate } from './ticker';
import { fetchAllBalances } from './transactions';

export default function rehydrationComplete(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate());
    dispatch(fetchAllBalances());
  };
}

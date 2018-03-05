import { Dispatch, ThunkAction } from './actions.types';
import { requestTickerUpdate } from './ticker';
import { fetchAllBalances, fetchAllTrades } from './transactions';

export default function rehydrationComplete(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate());
    dispatch(fetchAllBalances());

    // Move trade timer a bit back to avoid nonce collisions
    window.setTimeout(() => dispatch(fetchAllTrades()), 1000);
  };
}

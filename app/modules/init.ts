import { Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { getTimers } from '../selectors/selectGlobalState';
import { fetchAllExchangeBalances } from './exchanges';
import { requestTickerUpdate } from './ticker';
import { EXCHANGE_BALANCE_TIMER, startTimer, WALLET_BALANCE_TIMER } from './timer';
import { fetchAllWalletBalances } from './wallets';

export function rehydrationComplete(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(requestTickerUpdate());
    dispatch(fetchAllExchangeBalances());
  };
}

const BALANCE_REFRESH_MS = 30000;

export function continuouslyFetchBalances(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getTimers(getState())[EXCHANGE_BALANCE_TIMER]) {
      const balanceTimer = window.setInterval(
        () => dispatch(fetchAllExchangeBalances()),
        BALANCE_REFRESH_MS
      );

      dispatch(startTimer(EXCHANGE_BALANCE_TIMER, balanceTimer));
    }

    if (!getTimers(getState())[WALLET_BALANCE_TIMER]) {
      const balanceTimer = window.setInterval(
        () => dispatch(fetchAllWalletBalances()),
        BALANCE_REFRESH_MS
      );

      dispatch(startTimer(WALLET_BALANCE_TIMER, balanceTimer));
    }
  };
}

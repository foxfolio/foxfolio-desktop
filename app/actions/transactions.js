// @flow
import ccxt from 'ccxt';
import { filter, forEachObjIndexed } from 'ramda';
import type {
  FailedExchangeRequestAction,
  IncrementExchangeRequestCounterAction,
  UpdateExchangeBalancesAction,
} from '../reducers/exchanges/actions.d';

import type { Balances, Exchange, Exchanges } from '../reducers/exchanges/types.d';
import type { Action, Dispatch, GetState, ThunkAction } from './action.d';
import startTimer from './timer';

const BALANCE_REFRESH_MS = 30000;

function setLastUpdate(): Action {
  return {
    type: 'LAST_UPDATED',
    key: 'transactions',
    time: new Date(),
  };
}

function updateExchangeBalances(id: string, balances: Balances): UpdateExchangeBalancesAction {
  return {
    type: 'UPDATE_EXCHANGE_BALANCES',
    id,
    balances,
  };
}

function incrementExchangeRequestCounter(id: string): IncrementExchangeRequestCounterAction {
  return {
    type: 'INCREMENT_EXCHANGE_REQUEST_COUNTER',
    id,
  };
}

function failedRequest(id: string, error: string): FailedExchangeRequestAction {
  return {
    type: 'FAILED_EXCHANGE_REQUEST',
    id,
    error,
  };
}

function getConfiguredExchanges(state): Exchanges {
  return state.exchanges;
}

function fetchBalancesForExchange(exchange: Exchange): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(incrementExchangeRequestCounter(exchange.id));
    try {
      const connector = new ccxt[exchange.type](exchange.credentials);
      const balances = filter(balance => balance > 0)(await connector.fetchTotalBalance());
      dispatch(updateExchangeBalances(exchange.id, balances));
    } catch (e) {
      dispatch(failedRequest(exchange.id, e.message));
    }
  };
}

export function fetchAllBalances(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(setLastUpdate());
    const exchanges = getConfiguredExchanges(getState());
    forEachObjIndexed(exchange => dispatch(fetchBalancesForExchange(exchange)))(exchanges);
  };
}

export function fetchAllTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    forEachObjIndexed(exchange => {
      const connector = new ccxt[exchange.type]();
      return dispatch(connector.fetchTotalBalance());
    })(getConfiguredExchanges(getState()));
  };
}

export function continuouslyFetchTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timer.balances) {
      const balanceTimer = setInterval(() => dispatch(fetchAllBalances()), BALANCE_REFRESH_MS);
      // const transactionTimer = setInterval(() => dispatch(fetchAllTransactions()), TRANSACTION_REFRESH_MS);
      dispatch(startTimer('balances', balanceTimer));
      // dispatch(startTimer('transactions', transactionTimer));
    }
  };
}

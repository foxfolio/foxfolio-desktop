// @flow
import type { ExchangeCredentials } from '../reducers/exchanges/types.d';
import type { Action, ThunkAction } from './action.d';
import { fetchAllTransactions } from './transactions';

export function addExchange(credentials: ExchangeCredentials): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: 'ADD_EXCHANGE',
      credentials,
    });
    dispatch(fetchAllTransactions());
  };
}

export function updateExchangeCredentials(id: string, credentials: ExchangeCredentials): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: 'UPDATE_EXCHANGE_CREDENTIALS',
      id,
      credentials,
    });
    dispatch(fetchAllTransactions());
  };
}

export function deleteExchange(id: string): Action {
  return {
    type: 'DELETE_EXCHANGE',
    id,
  };
}


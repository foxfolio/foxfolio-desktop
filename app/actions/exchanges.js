// @flow
import type { ExchangeCredentials } from '../reducers/exchanges/types.d';
import type { Action, ThunkAction } from './action.d';
import { fetchAllBalances } from './transactions';

export function addExchange(type: string, credentials: ExchangeCredentials): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: 'ADD_EXCHANGE',
      exchangeType: type,
      credentials,
    });
    dispatch(fetchAllBalances());
  };
}

export function updateExchangeCredentials(id: string, credentials: ExchangeCredentials): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: 'UPDATE_EXCHANGE_CREDENTIALS',
      id,
      credentials,
    });
    dispatch(fetchAllBalances());
  };
}

export function deleteExchange(id: string): Action {
  return {
    type: 'DELETE_EXCHANGE',
    id,
  };
}


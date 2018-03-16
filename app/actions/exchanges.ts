import { ExchangeCredentials, ExchangeTypeKeys, Trade } from '../reducers/exchanges.types';
import { Action, ThunkAction } from './actions.types';
import { fetchAllBalances } from './transactions';

export function addExchange(type: string, credentials: ExchangeCredentials): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: ExchangeTypeKeys.ADD_EXCHANGE,
      exchangeType: type,
      credentials,
    });
    dispatch(fetchAllBalances());
  };
}

export function updateExchangeCredentials(
  id: string,
  credentials: ExchangeCredentials
): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: ExchangeTypeKeys.UPDATE_EXCHANGE_CREDENTIALS,
      id,
      credentials,
    });
    dispatch(fetchAllBalances());
  };
}

export function updateExchangeTrades(id: string, trades: Trade[]): Action {
  return {
    type: ExchangeTypeKeys.UPDATE_EXCHANGE_TRADES,
    id,
    trades,
  };
}

export function deleteExchange(id: string): Action {
  return {
    type: ExchangeTypeKeys.DELETE_EXCHANGE,
    id,
  };
}

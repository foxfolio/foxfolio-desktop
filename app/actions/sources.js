// @flow
import type { Exchange } from './exchange.d';
import type { Action, ThunkAction } from './action.d';
import { fetchAllTransactions, readTransactionsFromFile } from './transactions';

export function addSource(exchange: Exchange): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'ADD_SOURCE',
      source: exchange,
    });
    if (exchange.transactionFile) {
      dispatch(readTransactionsFromFile(exchange));
    }
    dispatch(fetchAllTransactions());
  };
}

export function editSource(exchange: Exchange, newExchange: Exchange): ThunkAction {
  return dispatch => {
    dispatch({
      type: 'EDIT_SOURCE',
      source: exchange,
      newSource: newExchange,
    });
    if (newExchange.transactionFile) {
      dispatch(readTransactionsFromFile(newExchange));
    }
    dispatch(fetchAllTransactions());
  };
}

export function deleteExchange(exchange: Exchange): Action {
  return {
    type: 'DELETE_EXCHANGE',
    exchange,
  };
}


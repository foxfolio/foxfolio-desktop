// @flow
import type { sourceType } from '../reducers/sources';
import type { ThunkAction } from './types';
import { fetchAllTransactions, readTransactionsFromFile } from './transactions';

export function addSource(source: sourceType): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'ADD_SOURCE',
      source,
    });
    if (source.transactionFile) {
      dispatch(readTransactionsFromFile(source));
    }
    dispatch(fetchAllTransactions());
  };
}

export function editSource(source: sourceType, newSource: sourceType): ThunkAction {
  return dispatch => {
    dispatch({
      type: 'EDIT_SOURCE',
      source,
      newSource,
    });
    if (newSource.transactionFile) {
      dispatch(readTransactionsFromFile(newSource));
    }
    dispatch(fetchAllTransactions());
  };
}

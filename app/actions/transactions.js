import { getTransactions as getBittrexTransactions } from './bittrex';

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS';

function requestTransactions(source) {
  return {
    type: REQUEST_TRANSACTIONS,
    source,
  };
}

export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS';

export function receiveTransactions(exchange, transactions) {
  return {
    type: RECEIVE_TRANSACTIONS,
    exchange,
    transactions,
  };
}

function getConfiguredSources(state) {
  return state.sources;
}

function fetchTransactions(source) {
  return dispatch => {
    dispatch(requestTransactions(source));
    return dispatch(getBittrexTransactions(source));
  };
}

export function fetchAllTransactions() {
  return (dispatch, getState) => {
    const sources = getConfiguredSources(getState());
    return sources.map(source => dispatch(fetchTransactions(source)));
  };
}

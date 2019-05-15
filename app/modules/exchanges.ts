import 'whatwg-fetch'; // Has to be imported before ccxt

import ccxt from 'ccxt';
import _ from 'lodash';
import { Action, Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { generateId } from '../helpers/reducers';
import { getExchangeBalances } from '../pages/portfolio/selectors/selectBalances';
import { getExchanges } from '../selectors/selectGlobalState';
import { unifySymbols } from '../utils/unifySymbols';
import {
  AddExchangeAction,
  Balances,
  DeleteExchangeAction,
  Exchange,
  ExchangeCredentials,
  ExchangeInstanceActions,
  Exchanges,
  ExchangeTypeKeys,
  FailedExchangeRequestAction,
  IncrementExchangeRequestCounterAction,
  Trade,
  UpdateExchangeBalancesAction,
  UpdateExchangeCredentialsAction,
  UpdateExchangeLedgerAction,
  UpdateExchangeTradesAction,
} from './exchanges.types';
import { GlobalState } from './index';
import { requestTickerUpdate } from './ticker';
import { EXCHANGE_BALANCE_TIMER, setLastUpdate } from './timer';


// Reducer
export default function reducer(state: Exchanges = {}, action: Action): Exchanges {
  switch (action.type) {
    case ExchangeTypeKeys.ADD_EXCHANGE:
      return addExchangeToState(state, action);
    case ExchangeTypeKeys.DELETE_EXCHANGE:
      return deleteExchangeFromState(state, action);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_CREDENTIALS:
      return reduceInstance(state, action)(updateExchangeCredentialsInState);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_BALANCES:
      return reduceInstance(state, action)(updateExchangeBalancesInState);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_LEDGER:
      return reduceInstance(state, action)(updateExchangeLedgerInState);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_TRADES:
      return reduceInstance(state, action)(updateExchangeTradesInState);
    case ExchangeTypeKeys.INCREMENT_EXCHANGE_REQUEST_COUNTER:
      return reduceInstance(state, action)(incrementExchangeRequestCounterInState);
    case ExchangeTypeKeys.FAILED_EXCHANGE_REQUEST:
      return reduceInstance(state, action)(addFailedRequestToState);
    default:
      return state;
  }
}

// Action Creators
export function addExchange(type: string, credentials: ExchangeCredentials): ThunkAction {
  return async dispatch => {
    await dispatch({
      type: ExchangeTypeKeys.ADD_EXCHANGE,
      exchangeType: type,
      credentials,
    });
    dispatch(fetchAllExchangeBalances());
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
    dispatch(fetchAllExchangeBalances());
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

export function fetchAllExchangeBalances(): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(setLastUpdate(EXCHANGE_BALANCE_TIMER));
    const exchanges = getConfiguredExchanges(getState());
    await Promise.all(_.map(exchanges, exchange => dispatch(fetchBalancesForExchange(exchange))));
  };
}

function updateExchangeBalances(id: string, balances: Balances): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const stateBalance = getExchangeBalances(getState())[id];
    if (!_.isEqual(_.keys(stateBalance), _.keys(balances))) {
      dispatch(requestTickerUpdate(_.keys(balances)));
      dispatch(fetchTradesForExchange(getExchanges(getState())[id]));
    }
    dispatch({
      type: ExchangeTypeKeys.UPDATE_EXCHANGE_BALANCES,
      id,
      balances,
    });
  };
}

function incrementExchangeRequestCounter(id: string): IncrementExchangeRequestCounterAction {
  return {
    type: ExchangeTypeKeys.INCREMENT_EXCHANGE_REQUEST_COUNTER,
    id,
  };
}

function failedRequest(id: string, error: string): FailedExchangeRequestAction {
  return {
    type: ExchangeTypeKeys.FAILED_EXCHANGE_REQUEST,
    id,
    error,
  };
}

function getConfiguredExchanges(state: GlobalState): Exchanges {
  return state.exchanges;
}

async function fetchBalances(exchange: Exchange) {
  const connector = new ccxt[exchange.type](exchange.credentials);
  if (exchange.type === 'bitfinex') {
    const totalBalances = {};
    for (const type of ['exchange', 'trading', 'deposit']) {
      const partialBalance = await connector.fetchTotalBalance({ type });
      Object.keys(partialBalance).forEach(key => {
        totalBalances[key] = (totalBalances[key] || 0) + partialBalance[key];
      });
    }
    return totalBalances;
  }
  return connector.fetchTotalBalance();
}

function fetchBalancesForExchange(exchange: Exchange): ThunkAction {
  return async (dispatch: Dispatch) => {
    await dispatch(incrementExchangeRequestCounter(exchange.id));
    try {
      const balances: Balances = _.pickBy(await fetchBalances(exchange), balance => balance > 0);
      await dispatch(
        updateExchangeBalances(exchange.id, _.mapKeys(balances, (value, key) => unifySymbols(key)))
      );
    } catch (e) {
      await dispatch(failedRequest(exchange.id, e.message));
    }
  };
}

function fetchTradesForExchange(exchange: Exchange): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(incrementExchangeRequestCounter(exchange.id));
    try {
      const connector: ccxt.Exchange = new ccxt[exchange.type](exchange.credentials);
      if (connector.has.fetchMyTrades) {
        const trades = await connector.fetchMyTrades();
        dispatch(updateExchangeTrades(exchange.id, normalizeTrades(trades)));
      } else {
        console.log('No orders...');
      }
    } catch (e) {
      console.log(e);
      dispatch(failedRequest(exchange.id, e.message));
    }
  };
}

const normalizeTrades = (trades: Trade[]) =>
  trades
    .filter(trade => trade.price > 0)
    .map(trade => ({
      ...trade,
      side: trade.side ? trade.side : trade.amount >= 0 ? 'buy' : 'sell',
    }))
    .map(trade => ({ ...trade, amount: Math.abs(trade.amount) }));

// State Helpers
function addExchangeToState(state: Exchanges, action: AddExchangeAction): Exchanges {
  const newExchange: Exchange = {
    id: generateId(Object.keys(state)),
    type: action.exchangeType,
    credentials: action.credentials,
    balances: {},
    ledger: [],
    trades: [],
  };
  return { ...state, [newExchange.id]: newExchange };
}

function deleteExchangeFromState(state: Exchanges, action: DeleteExchangeAction): Exchanges {
  return _.omit(state, action.id);
}

function updateExchangeCredentialsInState(
  state: Exchange,
  action: UpdateExchangeCredentialsAction
): Exchange {
  return assign(state, {
    credentials: action.credentials,
  });
}

function updateExchangeBalancesInState(
  state: Exchange,
  action: UpdateExchangeBalancesAction
): Exchange {
  return assign(state, noError, decrementOpenRequests(state), {
    balances: action.balances,
  });
}

function updateExchangeLedgerInState(
  state: Exchange,
  action: UpdateExchangeLedgerAction
): Exchange {
  return assign(state, noError, decrementOpenRequests(state), {
    ledger: mergeArraysById(state.ledger, action.ledger),
  });
}

function updateExchangeTradesInState(
  state: Exchange,
  action: UpdateExchangeTradesAction
): Exchange {
  return assign(state, noError, decrementOpenRequests(state), {
    trades: mergeArraysById(state.trades, action.trades),
  });
}

function incrementExchangeRequestCounterInState(state: Exchange): Exchange {
  return assign(state, {
    openRequests: (state.openRequests ? state.openRequests : 0) + 1,
  });
}

function addFailedRequestToState(state: Exchange, action: FailedExchangeRequestAction): Exchange {
  return assign(state, decrementOpenRequests(state), {
    error: action.error,
  });
}

const noError: Partial<Exchange> = {
  error: undefined,
};

const decrementOpenRequests: ((state: Exchange) => Partial<Exchange>) = (state: Exchange) => ({
  openRequests: (state.openRequests ? state.openRequests : 0) - 1,
});

type InstanceReducer<A extends ExchangeInstanceActions> = (state: Exchange, action: A) => Exchange;

function reduceInstance<A extends ExchangeInstanceActions>(
  state: Exchanges,
  action: A
): (reducer: InstanceReducer<A>) => Exchanges {
  return instanceReducer => ({ ...state, [action.id]: instanceReducer(state[action.id], action) });
}

function mergeArraysById<T extends { id: any }>(array: T[], newArray: T[]): T[] {
  return _.unionWith(array, newArray, (a, b) => _.isEqualWith(a, b, _.property('id')));
}

const assign: <T>(a: T, ...b: Array<Partial<T>>) => T = (a, ...b) => Object.assign({}, a, ...b);

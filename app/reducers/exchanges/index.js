// @flow
import R, { omit } from 'ramda';

import { generateId } from '../../helpers/reducers';

import type { Action } from '../../actions/action.d';
import type { Exchange, Exchanges } from './types.d';
import type {
  AddExchangeAction,
  DeleteExchangeAction,
  ExchangeInstanceActions,
  UpdateExchangeBalancesAction,
  UpdateExchangeCredentialsAction,
  UpdateExchangeLedgerAction,
  UpdateExchangeTradesAction,
} from './actions.d';

export function exchanges(state: Exchanges = {}, action: Action): Exchanges {
  switch (action.type) {
    case 'ADD_EXCHANGE':
      return addExchange(state, action);
    case 'DELETE_EXCHANGE':
      return deleteExchange(state, action);
    case 'UPDATE_EXCHANGE_CREDENTIALS':
      return reduceInstance(state, action)(updateExchangeCredentials);
    case 'UPDATE_EXCHANGE_BALANCES':
      return reduceInstance(state, action)(updateExchangeBalances);
    case 'UPDATE_EXCHANGE_LEDGER':
      return reduceInstance(state, action)(updateExchangeLedger);
    case 'UPDATE_EXCHANGE_TRADES':
      return reduceInstance(state, action)(updateExchangeTrades);

    default:
      return state;
  }
}

function addExchange(state: $ReadOnly<Exchanges>, action: AddExchangeAction): Exchanges {
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

function deleteExchange(state: $ReadOnly<Exchanges>, action: DeleteExchangeAction): Exchanges {
  return omit([action.id], state);
}

function updateExchangeCredentials(state: Exchange, action: UpdateExchangeCredentialsAction): Exchange {
  return assign(state, {
    credentials: action.credentials,
  });
}

function updateExchangeBalances(state: Exchange, action: UpdateExchangeBalancesAction): Exchange {
  return assign(state, {
    balances: action.balances,
  });
}

function updateExchangeLedger(state: Exchange, action: UpdateExchangeLedgerAction): Exchange {
  return assign(state, {
    ledger: mergeArraysById(state.ledger, action.ledger),
  });
}

function updateExchangeTrades(state: Exchange, action: UpdateExchangeTradesAction): Exchange {
  return assign(state, {
    trades: mergeArraysById(state.ledger, action.trades),
  });
}

// TODO(greimela) Add exact typing
function reduceInstance(state: $ReadOnly<Exchanges>, action: ExchangeInstanceActions): Function => Exchanges {
  return instanceReducer => ({ ...state, [action.id]: instanceReducer(state[action.id], action) });
}

function mergeArraysById<T>(array: T[], newArray: T[]): T[] {
  return R.unionWith(R.eqBy(R.prop('id')), array, newArray);
}

// Required until the issue with spread operator typing is resolved: https://github.com/facebook/flow/issues/2405
const assign = <T>(a: T, ...b: $Shape<T>[]): T => Object.assign({}, a, ...b);

import R, { omit } from 'ramda';

import { generateId } from '../helpers/reducers';

import { Action } from '../actions/action';
import { Exchange, Exchanges, ExchangeTypeKeys } from 'reducers/exchangeTypes';
import {
  AddExchangeAction,
  DeleteExchangeAction,
  ExchangeInstanceActions,
  FailedExchangeRequestAction,
  UpdateExchangeBalancesAction,
  UpdateExchangeCredentialsAction,
  UpdateExchangeLedgerAction,
  UpdateExchangeTradesAction,
} from 'reducers/exchangeTypes';

export function exchanges(state: Exchanges = {}, action: Action): Exchanges {
  switch (action.type) {
    case ExchangeTypeKeys.ADD_EXCHANGE:
      return addExchange(state, action);
    case ExchangeTypeKeys.DELETE_EXCHANGE:
      return deleteExchange(state, action);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_CREDENTIALS:
      return reduceInstance(state, action)(updateExchangeCredentials);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_BALANCES:
      return reduceInstance(state, action)(updateExchangeBalances);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_LEDGER:
      return reduceInstance(state, action)(updateExchangeLedger);
    case ExchangeTypeKeys.UPDATE_EXCHANGE_TRADES:
      return reduceInstance(state, action)(updateExchangeTrades);
    case ExchangeTypeKeys.INCREMENT_EXCHANGE_REQUEST_COUNTER:
      return reduceInstance(state, action)(incrementExchangeRequestCounter);
    case ExchangeTypeKeys.FAILED_EXCHANGE_REQUEST:
      return reduceInstance(state, action)(failedRequest);
    default:
      return state;
  }
}

function addExchange(state: Exchanges, action: AddExchangeAction): Exchanges {
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

function deleteExchange(state: Exchanges, action: DeleteExchangeAction): Exchanges {
  return omit([action.id], state);
}

function updateExchangeCredentials(state: Exchange, action: UpdateExchangeCredentialsAction): Exchange {
  return assign(state, {
    credentials: action.credentials,
  });
}

function updateExchangeBalances(state: Exchange, action: UpdateExchangeBalancesAction): Exchange {
  return assign(state,
    noError,
    decrementOpenRequests(state),
    {
      balances: action.balances
    }
  );
}

function updateExchangeLedger(state: Exchange, action: UpdateExchangeLedgerAction): Exchange {
  return assign(state,
    noError,
    decrementOpenRequests(state),
    {
      ledger: mergeArraysById(state.ledger, action.ledger)
    }
  );
}

function updateExchangeTrades(state: Exchange, action: UpdateExchangeTradesAction): Exchange {
  return assign(state,
    noError,
    decrementOpenRequests(state),
    {
      trades: mergeArraysById(state.ledger, action.trades),
    }
  );
}

function incrementExchangeRequestCounter(state: Exchange): Exchange {
  return assign(state, {
    openRequests: (state.openRequests ? state.openRequests : 0) + 1,
  });
}

function failedRequest(state: Exchange, action: FailedExchangeRequestAction): Exchange {
  return assign(state,
    decrementOpenRequests(state),
    {
      error: action.error
    }
  );
}

const noError: Partial<Exchange> = {
  error: undefined
};

const decrementOpenRequests: ((state: Exchange) => Partial<Exchange>)
  = (state: Exchange) => ({ openRequests: (state.openRequests ? state.openRequests : 0) - 1 });

type InstanceReducer<A extends ExchangeInstanceActions> = (state: Exchange, action: A) => Exchange;

function reduceInstance<A extends ExchangeInstanceActions>(state: Exchanges, action: A): (reducer: InstanceReducer<A>) => Exchanges {
  return instanceReducer => ({ ...state, [action.id]: instanceReducer(state[action.id], action) });
}

function mergeArraysById<T extends { id }>(array: T[], newArray: T[]): T[] {
  return R.unionWith(R.eqBy(R.prop('id')), array, newArray);
}

const assign: <T>(a: T, ...b: Partial<T>[]) => T = (a, ...b) => Object.assign({}, a, ...b);

import * as _ from 'lodash';
import { Action } from '../actions/actions.types';
import { generateId } from '../helpers/reducers';
import { Trade } from './exchanges.types';
import { TradesMap } from './trades.types';

// Reducer
export default function reducer(state: TradesMap = {}, action: Action) {
  switch (action.type) {
    case 'ADD_TRADE':
      return addTradeToState(state, action.trade);
    case 'UPDATE_TRADE':
      return updateTradeInState(state, action.trade);
    case 'DELETE_TRADE':
      return deleteTradeFromState(state, action.id);
    default:
      return state;
  }
}

// Action Creators
export function addTrade(trade: Trade): Action {
  return {
    type: 'ADD_TRADE',
    trade,
  };
}

export function updateTrade(id: string, trade: Trade): Action {
  return {
    type: 'UPDATE_TRADE',
    id,
    trade,
  };
}

export function deleteTrade(id: string): Action {
  return {
    type: 'DELETE_TRADE',
    id,
  };
}

// State Helpers
const addTradeToState = (state: TradesMap, trade: Trade): TradesMap => {
  const newTrade = {
    ...trade,
    id: generateId(Object.keys(state)),
  };
  return { ...state, [newTrade.id]: newTrade };
};

const updateTradeInState = (state: TradesMap, trade: Trade): TradesMap => {
  return { ...state, [trade.id]: trade };
};

const deleteTradeFromState = (state: TradesMap, id: string): TradesMap => {
  return _.omit(state, id);
};

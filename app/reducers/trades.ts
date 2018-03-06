import * as _ from 'lodash';
import { Action } from '../actions/actions.types';
import { generateId } from '../helpers/reducers';
import { Trade } from './exchanges.types';

export interface TradesMap {
  [id: string]: Trade;
}

export const trades = (state: TradesMap = {}, action: Action) => {
  switch (action.type) {
    case 'ADD_TRADE':
      return addTrade(state, action.trade);
    case 'UPDATE_TRADE':
      return updateTrade(state, action.trade);
    case 'DELETE_TRADE':
      return deleteTrade(state, action.id);
    default:
      return state;
  }
};

const addTrade = (state: TradesMap, trade: Trade): TradesMap => {
  const newTrade = {
    ...trade,
    id: generateId(Object.keys(state)),
  };
  return { ...state, [newTrade.id]: newTrade };
};

const updateTrade = (state: TradesMap, trade: Trade): TradesMap => {
  return { ...state, [trade.id]: trade };
};

const deleteTrade = (state: TradesMap, id: string): TradesMap => {
  return _.omit(state, id);
};

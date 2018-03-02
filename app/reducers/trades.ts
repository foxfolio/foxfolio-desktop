import { Action } from '../actions/actions.types';
import { Trade } from './exchanges.types';

export interface TradesMap {
  [id: string]: Trade;
}

export const trades = (state: TradesMap = {}, action: Action) => {
  return state;
};

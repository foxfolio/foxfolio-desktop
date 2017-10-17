// @flow
import type { sourceType } from '../reducers/sources';
import type { Action } from './types';

export function addSource(source: sourceType): Action {
  return {
    type: 'ADD_SOURCE',
    source,
  };
}

export function editSource(source: sourceType, newSource: sourceType): Action {
  return {
    type: 'EDIT_SOURCE',
    source,
    newSource,
  };
}

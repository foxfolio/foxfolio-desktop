// @flow
import type { sourceType } from '../reducers/sources';

export const ADD_SOURCE = 'ADD_SOURCE';
export const EDIT_SOURCE = 'EDIT_SOURCE';

export type Action =
  | { type: string }
  | AddSourceAction
  | EditSourceAction;

export type AddSourceAction = {
  type: 'ADD_SOURCE',
  source: sourceType
};

export type EditSourceAction = {
  type: 'EDIT_SOURCE',
  oldSource: sourceType,
  newSource: sourceType
};

export function addSource(source: sourceType) {
  return {
    type: ADD_SOURCE,
    source,
  };
}

export function editSource(oldSource: sourceType, newSource: sourceType) {
  return {
    type: EDIT_SOURCE,
    oldSource,
    newSource,
  };
}

// @flow
import type { sourceType } from '../reducers/sources';

export const ADD_SOURCE = 'ADD_SOURCE';

export function addSource(source: sourceType) {
  return {
    type: ADD_SOURCE,
    source,
  };
}

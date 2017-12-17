// @flow
import { contains } from 'ramda';
import shortid from 'shortid';

export function generateId(existingIds: string[]): string {
  let id = shortid.generate();
  while (contains(id)(existingIds)) {
    id = shortid.generate();
  }
  return id;
}

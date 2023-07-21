import _ from 'lodash';
import shortid from 'shortid';

export function generateId(existingIds: string[]): string {
  let id = shortid.generate();
  while (_.some(existingIds, existingId => existingId === id)) {
    id = shortid.generate();
  }
  return id;
}

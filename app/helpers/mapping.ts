import R from 'ramda';

export const mapKeys = R.curry((fn: any, obj: object) =>
  R.zipObj(R.map(fn, R.keys(obj)), R.values(obj))
);

export const mapObject = <T, K extends keyof T, V>(
  fn: (item: T[K]) => V,
  object: T
): Record<K, V> => Object.assign({}, ...Object.keys(object).map(k => ({ [k]: fn(object[k]) })));

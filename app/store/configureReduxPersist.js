// @flow
import * as R from 'ramda';
import { createTransform, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const configureReduxPersist = (): PersistConfig => {
// $FlowFixMe
  const mapPath = R.curry((path, f, obj) => R.assocPath(path, f(R.path(path, obj)), obj));

  const convertDate = R.map(mapPath(['date'], dateString => new Date(dateString)));
  const convertDateIn = key => R.map(mapPath([key], convertDate));

  const dateTransform = createTransform(null, (outboundState, key) => {
    if (key === 'transactions' && Object.keys(outboundState).length > 0) {
      return R.pipe(convertDateIn('transfers'), convertDateIn('trades'))(outboundState);
    }
    return outboundState;
  });

  const exchangeTransform = createTransform(
    (inboundState, key) => {
      if (key === 'exchanges') {
        return R.map(R.omit(['openRequests']))(inboundState);
      }
      return inboundState;
    },
  );

  return {
    key: 'primary',
    blacklist: ['router', 'timer'],
    transforms: [dateTransform, exchangeTransform],
    storage,
  };
};

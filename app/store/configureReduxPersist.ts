import * as R from 'ramda';
import { createMigrate, createTransform, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { GlobalState } from '../reducers';

export const configureReduxPersist = (): PersistConfig => ({
  version: 0,
  key: 'primary',
  blacklist: ['router', 'timer'],
  transforms: [createDateTransform(), createExchangeTransform()],
  migrate: createMigrate(migrations, { debug: false }),
  storage,
});

const createExchangeTransform = () =>
  createTransform((inboundState, key) => {
    if (key === 'exchanges') {
      return R.map(R.omit(['openRequests']))(inboundState);
    }
    return inboundState;
  });

const createDateTransform = () => {
  const mapPath = R.curry((path, f, obj) => R.assocPath(path, f(R.path(path, obj)), obj));

  const convertDate = R.map(mapPath(['date'], dateString => new Date(dateString)));
  const convertDateIn = key => R.map(mapPath([key], convertDate));

  return createTransform(null, (outboundState, key) => {
    if (key === 'transactions' && Object.keys(outboundState).length > 0) {
      return R.pipe(convertDateIn('transfers'), convertDateIn('trades'))(outboundState);
    }
    return outboundState;
  });
};

const migrations = {
  0: (state: GlobalState): GlobalState => ({
    ...state,
    ticker: { ...state.ticker, ticker: {}, history: {} },
  }),
};

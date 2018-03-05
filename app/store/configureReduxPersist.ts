import _ from 'lodash';
import { createMigrate, createTransform, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { GlobalState } from '../reducers';

export const configureReduxPersist = (): PersistConfig => ({
  version: 0,
  key: 'primary',
  blacklist: ['router', 'timer'],
  transforms: [createExchangeTransform()],
  migrate: createMigrate(migrations, { debug: false }),
  storage,
});

const createExchangeTransform = () =>
  createTransform((inboundState, key) => {
    if (key === 'exchanges') {
      return _.map(inboundState, object => _.omit(object, 'openRequests'));
    }
    return inboundState;
  });

const migrations = {
  0: (state: GlobalState): GlobalState => ({
    ...state,
    ticker: { ...state.ticker, ticker: {}, history: {} },
  }),
};

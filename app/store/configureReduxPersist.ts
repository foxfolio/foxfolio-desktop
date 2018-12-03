import _ from 'lodash';
import { createMigrate, createTransform, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { generateId } from '../helpers/reducers';
import { GlobalState } from '../modules';

export const configureReduxPersist = (): PersistConfig => ({
  version: 1,
  key: 'primary',
  blacklist: ['router', 'timer'],
  transforms: [createExchangeTransform()],
  migrate: createMigrate(migrations as any, { debug: false }),
  storage,
});

const createExchangeTransform = () =>
  createTransform((inboundState, key) => {
    if (key === 'exchanges') {
      return _.mapValues(inboundState, object => _.omit(object, 'openRequests'));
    }
    return inboundState;
  }, _.identity);

const migrations = {
  0: (state: GlobalState): GlobalState => ({
    ...state,
    ticker: { ...state.ticker, ticker: {}, history: {} },
  }),
  1: (state: GlobalState): GlobalState => ({
    ...state,
    wallets: Object.values(state.wallets).reduce((acc, val) => {
      if (val.id) {
        return { ...acc, [val.id]: val };
      } else {
        const id = generateId(Object.keys(state.wallets));
        return { ...acc, [id]: { ...val, id } };
      }
    }, {}),
  }),
};

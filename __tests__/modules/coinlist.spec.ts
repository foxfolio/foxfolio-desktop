import axios from 'axios';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import coinlist, { requestCoinList } from '../../app/modules/coinlist';
import { Coinlist } from '../../app/modules/coinlist.types';
import { getCoinlist } from '../../app/selectors/selectGlobalState';
import { Store } from '../../app/store/configureStore';

let store: Store;

jest.mock('axios');

beforeEach(() => {
  store = createStore(combineReducers({ coinlist }), applyMiddleware(thunk)) as Store;
});

test('requestCoinList', async () => {
  const testCoinList: Coinlist = {
    BTC: { FullName: 'Bitcoin', ImageUrl: 'image_url', SortOrder: '1' },
    ETH: { FullName: 'Ethereum', ImageUrl: 'image_url', SortOrder: '2' },
  };

  (axios.get as any).mockResolvedValue({ data: { Data: testCoinList } });

  await store.dispatch(requestCoinList());

  expect(getCoinlist(store.getState())).toMatchObject(testCoinList);
});

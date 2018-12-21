import { migrations } from '../../app/store/configureReduxPersist';

test('migration 0 -> 1', () => {
  const oldState: any = { wallets: [{ currency: 'BTC', quantity: 2 }] };
  const newState = migrations['1'](oldState);

  const walletKeys = Object.keys(newState.wallets);
  expect(walletKeys).toHaveLength(1);
  expect(newState.wallets[walletKeys[0]]).toMatchObject({
    id: walletKeys[0],
    currency: 'BTC',
    quantity: 2,
  });
});

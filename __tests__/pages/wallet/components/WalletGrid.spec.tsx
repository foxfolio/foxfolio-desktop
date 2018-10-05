import { createShallow } from '@material-ui/core/test-utils';
import * as React from 'react';
import { Wallet } from '../../../../app/modules/wallets.types';
import { WalletGrid } from '../../../../app/pages/wallet/components/WalletGrid';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

let wallets: Wallet[];

beforeEach(() => {
  wallets = [{ address: '', currency: 'BTC', quantity: 1 }];
});

test('Render wallet grid', () => {
  const coinlist = {};
  const addWallet = jest.fn();
  const editWallet = jest.fn();
  const deleteWallet = jest.fn();

  const wrapper = shallow(
    <WalletGrid
      coinlist={coinlist}
      wallets={wallets}
      addWallet={addWallet}
      editWallet={editWallet}
      deleteWallet={deleteWallet}
    />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

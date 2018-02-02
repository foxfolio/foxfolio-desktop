// @flow
import * as React from 'react';
import { createShallow } from 'material-ui/test-utils';
import type { Wallet } from '../../../../app/reducers/wallets/types.d';
import WalletGrid from '../../../../app/pages/wallet/components/WalletGrid';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

let wallets: Wallet[];

beforeEach(() => {
  wallets = [{ address: '', currency: 'BTC', quantity: 1 }];
});

test('Render wallet grid', () => {
  const wrapper = shallow(<WalletGrid wallets={wallets}/>)
    .dive();
  expect(wrapper)
    .toMatchSnapshot();
});

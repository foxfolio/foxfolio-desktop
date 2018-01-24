// @flow
import * as React from 'react';
import { createShallow } from 'material-ui/test-utils';
import EmptyPortfolio from '../../../../app/pages/portfolio/components/EmptyPortfolio';
import Portfolio from '../../../../app/pages/portfolio/container/Portfolio';
import type { Balances } from '../../../../app/reducers/exchanges/types.d';
import { initialSettings } from '../../../../app/reducers/settings';
import type { Wallet } from '../../../../app/reducers/wallets/types.d';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

let balances: { [string]: Balances };
let coinlist;
let ticker;
let wallets: Wallet[];

beforeEach(() => {
  balances = {};
  coinlist = {};
  ticker = {};
  wallets = [];
});


test('Render portfolio page', () => {
  balances = { exchange: { BTC: 5 } };
  ticker = { BTC: { USD: { PRICE: 1000, CHANGEPCT24HOUR: 2 } } };
  wallets = [{ address: '', currency: 'BTC', quantity: 1 }];

  const wrapper = shallow(
    <Portfolio
      balances={balances}
      coinlist={coinlist}
      settings={initialSettings}
      ticker={ticker}
      wallets={wallets}
    />);
  expect(wrapper).toMatchSnapshot();
});

test('Render empty portfolio when ticker is empty', () => {
  balances = { exchange: { BTC: 1 } };

  const wrapper = shallow(
    <Portfolio
      balances={balances}
      coinlist={coinlist}
      settings={initialSettings}
      ticker={ticker}
      wallets={wallets}
    />);
  expect(wrapper.contains(<EmptyPortfolio/>)).toBeTruthy();
});

test('Render empty portfolio when balances and wallets are empty', () => {
  ticker = { BTC: { USD: { PRICE: 1000, CHANGEPCT24HOUR: 2 } } };

  const wrapper = shallow(
    <Portfolio
      balances={balances}
      coinlist={coinlist}
      settings={initialSettings}
      ticker={ticker}
      wallets={wallets}
    />);
  expect(wrapper.contains(<EmptyPortfolio/>)).toBeTruthy();
});


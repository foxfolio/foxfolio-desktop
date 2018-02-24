import { createShallow } from 'material-ui/test-utils';
import * as React from 'react';
import { EmptyPortfolio } from '../../../../app/pages/portfolio/components/EmptyPortfolio';
import { PortfolioContainer } from '../../../../app/pages/portfolio/container/Portfolio';
import {
  Portfolio,
  PortfolioChange,
  PortfolioSum,
} from '../../../../app/pages/portfolio/types/portfolio.types';
import { Coinlist } from '../../../../app/reducers/coinlist';
import { initialSettings } from '../../../../app/reducers/settings';
import { Ticker } from '../../../../app/reducers/ticker';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

let coinlist: Coinlist;
let ticker: Ticker;
let portfolio: Portfolio;
let sum: PortfolioSum;
let change: PortfolioChange;

beforeEach(() => {
  coinlist = {};
  ticker = {};
});

test('Render portfolio page', () => {
  ticker = { BTC: { USD: { PRICE: 1000, CHANGEPCT24HOUR: 2 } } };

  portfolio = {
    total: { BTC: 6 },
    exchanges: { exchange: { BTC: 5 } },
    wallets: { BTC: 1 },
  };
  sum = { fiat: 6000, crypto: 6 };

  change = {
    fiat: 6000,
    crypto: 6,
  };

  const wrapper = shallow(
    <PortfolioContainer
      portfolio={portfolio}
      coinlist={coinlist}
      settings={initialSettings}
      ticker={ticker}
      sum={sum}
      change={change}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test('Render empty portfolio when ticker is empty', () => {
  portfolio = {
    total: { BTC: 6 },
    exchanges: { exchange: { BTC: 5 } },
    wallets: { BTC: 1 },
  };
  sum = { fiat: 6000, crypto: 6 };

  change = {
    fiat: 6000,
    crypto: 6,
  };

  const wrapper = shallow(
    <PortfolioContainer
      portfolio={portfolio}
      coinlist={coinlist}
      settings={initialSettings}
      ticker={ticker}
      sum={sum}
      change={change}
    />
  );
  expect(wrapper.contains(<EmptyPortfolio />)).toBeTruthy();
});

test('Render empty portfolio when balances and wallets are empty', () => {
  ticker = { BTC: { USD: { PRICE: 1000, CHANGEPCT24HOUR: 2 } } };
  portfolio = {
    total: {},
    exchanges: {},
    wallets: {},
  };
  sum = { fiat: 0, crypto: 0 };

  change = {
    fiat: 0,
    crypto: 0,
  };
  const wrapper = shallow(
    <PortfolioContainer
      portfolio={portfolio}
      coinlist={coinlist}
      settings={initialSettings}
      ticker={ticker}
      sum={sum}
      change={change}
    />
  );
  expect(wrapper.contains(<EmptyPortfolio />)).toBeTruthy();
});

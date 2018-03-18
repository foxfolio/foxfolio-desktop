import { createShallow } from 'material-ui/test-utils';
import * as React from 'react';
import { PortfolioPosition } from '../../../../app/pages/portfolio/components/PortfolioPosition';
import { initialSettings } from '../../../../app/reducers/settings';
import { Ticker } from '../../../../app/reducers/ticker';
import { CryptoCurrency, FiatCurrency } from '../../../../app/utils/currencies';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

let coinlist = {};
let ticker: Ticker;
const settings = { ...initialSettings, fiatCurrency: 'USD' as FiatCurrency };

beforeEach(() => {
  coinlist = {};
  ticker = {
    BTC: { USD: { PRICE: 10000, CHANGEPCT24HOUR: 1.1 } },
    ETH: {
      BTC: { PRICE: 0.1, CHANGEPCT24HOUR: 2 },
      USD: { PRICE: 1000, CHANGEPCT24HOUR: 5.2 },
    },
  };
});

test('Render portfolio position', () => {
  const asset = 'ETH';
  const portfolio = {
    total: 10,
    wallets: 2,
    exchanges: { exchangeKey: 8 },
  };

  const wrapper = shallow(
    <PortfolioPosition
      asset={asset}
      coinlist={coinlist}
      portfolio={portfolio}
      settings={settings}
      ticker={ticker}
    />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

test('Portfolio position with missing ticker', () => {
  const asset = 'ETH';
  const portfolio = {
    total: 10,
    wallets: 2,
    exchanges: { exchangeKey: 8 },
  };

  ticker = {
    BTC: { BTC: { PRICE: 1, CHANGEPCT24HOUR: 0 }, USD: { PRICE: 10000, CHANGEPCT24HOUR: 1.1 } },
    ETH: {
      USD: { PRICE: 1000, CHANGEPCT24HOUR: 5.2 },
    },
  };

  const wrapper = shallow(
    <PortfolioPosition
      asset={asset}
      coinlist={coinlist}
      portfolio={portfolio}
      settings={settings}
      ticker={ticker}
    />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

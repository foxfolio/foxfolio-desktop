import { createShallow } from 'material-ui/test-utils';
import * as React from 'react';
import {
  filterPortfolioForAsset,
  PortfolioPositions,
} from '../../../../app/pages/portfolio/components/PortfolioPositions';
import { Portfolio } from '../../../../app/pages/portfolio/types/portfolio.types';
import { initialSettings } from '../../../../app/reducers/settings';
import { Ticker } from '../../../../app/reducers/ticker';
import { FiatCurrency } from '../../../../app/utils/currencies';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

test('Render portfolio positions', () => {
  const coinlist = {};
  const portfolio: Portfolio = {
    total: { BTC: 5, ETH: 10 },
    wallets: { BTC: 4, ETH: 8 },
    exchanges: { key: { BTC: 1, ETH: 2 } },
  };
  const ticker: Ticker = {
    BTC: { BTC: { PRICE: 1, CHANGEPCT24HOUR: 0 }, USD: { PRICE: 10000, CHANGEPCT24HOUR: 1.1 } },
    ETH: {
      BTC: { PRICE: 0.1, CHANGEPCT24HOUR: 2 },
      USD: { PRICE: 1000, CHANGEPCT24HOUR: 5.2 },
    },
  };
  const settings = { ...initialSettings, fiatCurrency: 'USD' as FiatCurrency };

  const wrapper = shallow(
    <PortfolioPositions
      coinlist={coinlist}
      portfolio={portfolio}
      settings={settings}
      ticker={ticker}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test('filterPortfolioForAsset', () => {
  const portfolio: Portfolio = {
    total: { BTC: 5, ETH: 10 },
    wallets: { BTC: 4, ETH: 8 },
    exchanges: { key: { BTC: 1, ETH: 2 } },
  };
  const portfolioForAsset = filterPortfolioForAsset(portfolio, 'ETH');

  expect(portfolioForAsset).toEqual({ total: 10, wallets: 8, exchanges: { key: 2 } });
});

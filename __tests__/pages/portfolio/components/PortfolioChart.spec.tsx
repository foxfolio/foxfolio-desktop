import { createShallow } from '@material-ui/core/test-utils';
import * as React from 'react';
import { initialSettings } from '../../../../app/modules/settings.types';
import { Ticker } from '../../../../app/modules/ticker.types';
import { PortfolioChart } from '../../../../app/pages/portfolio/components/PortfolioChart';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

test('Render portfolio chart', () => {
  const portfolio = { BTC: 5, ETH: 10 };
  const ticker: Ticker = {
    BTC: { BTC: { PRICE: 1, CHANGEPCT24HOUR: 0 } },
    ETH: { BTC: { PRICE: 0.1, CHANGEPCT24HOUR: 2 } },
  };

  const wrapper = shallow(
    <PortfolioChart portfolio={portfolio} settings={initialSettings} sum={6} ticker={ticker} />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

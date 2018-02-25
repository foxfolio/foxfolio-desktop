import { createMount } from 'material-ui/test-utils';
import * as React from 'react';
import { ThemedTokenLineChart } from '../../app/components/TokenLineChart';

let mount;

beforeAll(() => {
  mount = createMount();
});

test('Render token line chart', () => {
  const fsym = 'ETH';
  const tsym = 'USD';

  const requestHistory = jest.fn();
  const history = {
    ETH: { USD: { lastUpdate: new Date(1519235310), data: [{ close: 10, time: 1000000 }] } },
  };

  const wrapper = mount(
    <ThemedTokenLineChart
      fsym={fsym}
      tsym={tsym}
      requestHistory={requestHistory}
      history={history}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

// @flow
import { createMount } from 'material-ui/test-utils';
import * as React from 'react';
import { RawTokenLineChart } from '../../app/components/TokenLineChart';

let mount;

beforeAll(() => {
  mount = createMount();
});

test('Render token line chart', () => {
  const fsym = 'ETH';
  const tsym = 'USD';

  // eslint-disable-next-line no-unused-vars
  const requestHistory = (a, b) => {
  };
  const history = { ETH: { USD: { data: [{ close: 10, time: 1000000 }] } } };
  const theme = { palette: { text: { secondary: '', divider: '' }, background: { paper: '' } } };

  const wrapper = mount(
    <RawTokenLineChart
      fsym={fsym}
      tsym={tsym}
      requestHistory={requestHistory}
      history={history}
      theme={theme}
    />);
  expect(wrapper).toMatchSnapshot();
});

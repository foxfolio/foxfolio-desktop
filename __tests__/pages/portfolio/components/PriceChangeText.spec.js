// @flow
import * as React from 'react';
import { createShallow } from 'material-ui/test-utils';
import PriceChangeText from '../../../../app/pages/portfolio/components/PriceChangeText';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

test('Positive change', () => {
  const wrapper = shallow(<PriceChangeText change={5}/>).dive();
  expect(wrapper).toMatchSnapshot();
});

test('Negative change', () => {
  const wrapper = shallow(<PriceChangeText change={-5}/>).dive();
  expect(wrapper).toMatchSnapshot();
});

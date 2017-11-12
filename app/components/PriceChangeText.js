// @flow
import React from 'react';

type Props = {
  change: number
};

export default function PriceChangeText({ change }: Props) {
  return (
    <span style={{ color: change > 0 ? 'green' : 'red' }}>
      {`${change > 0 ? '+' : ''}${(change).toFixed(2)}%`}
    </span>
  );
}

// @flow
import React, { Component } from 'react';

type Props = {
  change: number
};

export default class PriceChangeText extends Component<Props> {
  render() {
    const { change } = this.props;
    return (
      <span style={{ color: change > 0 ? 'green' : 'red' }}>
        {`${change > 0 ? '+' : ''}${(change).toFixed(2)}%`}
      </span>
    );
  }
}

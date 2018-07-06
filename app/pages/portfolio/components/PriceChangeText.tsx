import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import { green, grey, red } from '@material-ui/core/colors';
import React from 'react';

const styles = createStyles({
  negative: {
    color: red[500],
  },
  negativeMuted: {
    color: red[300],
  },
  positive: {
    color: green[500],
  },
  positiveMuted: {
    color: green[300],
  },
  interval: {
    fontSize: 12,
    color: grey[700],
  },
  intervalMuted: {
    fontSize: 12,
    color: grey[500],
  },
});

interface Props {
  change: number;
  muted?: boolean;
}

export const PriceChangeText = withStyles(styles)<Props>(({ change, classes, muted }) => {
  let className = classes.positive;
  if (change > 0 && muted) {
    className = classes.positiveMuted;
  } else if (change < 0 && !muted) {
    className = classes.negative;
  } else if (change < 0 && muted) {
    className = classes.negativeMuted;
  }
  return (
    <div style={{ display: 'inline-block' }}>
      <span className={className}>{`${change > 0 ? '+' : ''}${change.toFixed(2)}%`}</span>
      <span className={muted ? classes.intervalMuted : classes.interval}> /24h</span>
    </div>
  );
});

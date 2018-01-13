// @flow
import React from 'react';
import { withStyles } from 'material-ui';

type Props = {
  change: number,
  muted: boolean,
  classes: Object
};

const styles = theme => ({
  negative: {
    color: theme.palette.error[500],
  },
  negativeMuted: {
    color: theme.palette.error[300],
  },
  positive: {
    color: theme.palette.success[500],
  },
  positiveMuted: {
    color: theme.palette.success[300],
  },
  interval: {
    fontSize: 12,
    color: theme.palette.grey[700],
  },
  intervalMuted: {
    fontSize: 12,
    color: theme.palette.grey[500],
  },
});

function PriceChangeText({ change, classes, muted }: Props) {
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
      <span className={className}>
        {`${change > 0 ? '+' : ''}${(change).toFixed(2)}%`}
      </span>
      <span className={muted ? classes.intervalMuted : classes.interval}> /24h</span>
    </div>
  );
}

export default withStyles(styles)(PriceChangeText);

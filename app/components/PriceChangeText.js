// @flow
import React from 'react';
import { withStyles } from 'material-ui';

type Props = {
  change: number,
  classes: Object
};

const styles = theme => ({
  negative: {
    color: theme.palette.error[500],
  },
  positive: {
    color: theme.palette.success[500],
  },
  interval: {
    fontSize: 12,
    color: 'grey',
  },
});

function PriceChangeText({ change, classes }: Props) {
  return (
    <div style={{ display: 'inline-block' }}>
      <span className={change > 0 ? classes.positive : classes.negative}>
        {`${change > 0 ? '+' : ''}${(change).toFixed(2)}%`}
      </span>
      <span className={classes.interval}> /24h</span>
    </div>
  );
}

export default withStyles(styles)(PriceChangeText);

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
});

function PriceChangeText({ change, classes }: Props) {
  return (
    <span className={change > 0 ? classes.positive : classes.negative}>
      {`${change > 0 ? '+' : ''}${(change).toFixed(2)}%`}
    </span>
  );
}

export default withStyles(styles)(PriceChangeText);

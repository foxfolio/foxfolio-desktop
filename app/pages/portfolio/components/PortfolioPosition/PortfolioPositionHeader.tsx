import Typography from '@material-ui/core/Typography';
import * as React from 'react';

export const PositionHeader = (name: string, quantity: number) => (
  <div>
    <Typography variant="body2" component="span" color={quantity > 0 ? 'default' : 'textSecondary'}>
      {name}
    </Typography>
    <Typography variant="body2" component="span" color="textSecondary">
      {quantity.toPrecision(5)}
    </Typography>
  </div>
);

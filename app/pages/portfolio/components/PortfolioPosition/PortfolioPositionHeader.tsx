import Typography from 'material-ui/Typography';
import * as React from 'react';

export const PositionHeader = (name: string, quantity: number) => (
  <div>
    <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
      {name}
    </Typography>
    <Typography type="body2" component="span" color="secondary">
      {quantity.toPrecision(5)}
    </Typography>
  </div>
);

// @flow
import React from 'react';
import { Grid, Typography } from 'material-ui';
import PriceChangeText from '../PriceChangeText';

type Props = {
  fiatCurrency: string,
  sum: { btc: number, fiat: number },
  change: { btc: number, fiat: number }
};

export default function PortfolioHeader({ fiatCurrency, sum, change }: Props) {
  return (
    <Grid container>
      <Grid item xs={2}/>
      <Grid item xs={4}>
        <Typography type="title">
          {sum.fiat.toPrecision(5)} {fiatCurrency} |&nbsp;
          <PriceChangeText change={change.fiat}/>
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography type="title" style={{ paddingLeft: 20 }}>
          {sum.btc.toPrecision(5)} BTC | <PriceChangeText change={change.btc}/>
        </Typography>
      </Grid>
    </Grid>
  );
}

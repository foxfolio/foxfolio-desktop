// @flow
import React from 'react';
import { Grid, Typography } from 'material-ui';
import PriceChangeText from './PriceChangeText';

type Props = {
  settings: {
    cryptoCurrency: 'BTC' | 'ETH',
    fiatCurrency: string
  },
  sum: { crypto: number, fiat: number },
  change: { crypto: number, fiat: number }
};

export default function PortfolioHeader({ settings, sum, change }: Props) {
  return (
    <Grid container>
      <Grid item xs={2}/>
      <Grid item xs={4}>
        <Typography type="title">
          {sum.fiat.toPrecision(5)} {settings.fiatCurrency} |&nbsp;
          <PriceChangeText change={change.fiat}/>
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography type="title" style={{ paddingLeft: 20 }}>
          {sum.crypto.toPrecision(5)} {settings.cryptoCurrency} | <PriceChangeText change={change.crypto}/>
        </Typography>
      </Grid>
    </Grid>
  );
}

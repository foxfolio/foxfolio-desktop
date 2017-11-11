// @flow
import React from 'react';
import { Grid, Typography } from 'material-ui';
import PriceChangeText from '../PriceChangeText';

type Props = {
  fiatCurrency: string,
  sum: { btc: number, fiat: number },
  ticker: Object
};

export default function PortfolioHeader({ fiatCurrency, sum, ticker }: Props) {
  return (
    <Grid container>
      <Grid item xs={2}/>
      <Grid item xs={4}>
        <Typography type="title">
          {sum.fiat.toPrecision(5)} {fiatCurrency} |&nbsp;
          <PriceChangeText change={ticker.BTC[fiatCurrency].CHANGEPCT24HOUR}/>
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography type="title" style={{ paddingLeft: 20 }}>
          {sum.btc.toPrecision(5)} BTC | <PriceChangeText change={ticker.BTC.BTC.CHANGEPCT24HOUR}/>
        </Typography>
      </Grid>
    </Grid>
  );
}

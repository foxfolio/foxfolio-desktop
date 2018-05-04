import { Grid, Typography } from 'material-ui';
import React from 'react';
import { SettingsType } from '../../../reducers/settings';
import { PortfolioChange, PortfolioSum } from '../types/portfolio.types';
import { PriceChangeText } from './PriceChangeText';

interface Props {
  settings: SettingsType;
  sum: PortfolioSum;
  change: PortfolioChange;
}

export const PortfolioHeader = ({ settings, sum, change }: Props) => {
  return (
    <Grid container>
      <Grid item xs={2} />
      <Grid item xs={4}>
        <Typography variant="title">
          {sum.fiat.toPrecision(5)} {settings.fiatCurrency} |&nbsp;
          <PriceChangeText change={change.fiat} />
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="title" style={{ paddingLeft: 20 }}>
          {sum.crypto.toPrecision(5)} {settings.cryptoCurrency} |{' '}
          <PriceChangeText change={change.crypto} />
        </Typography>
      </Grid>
    </Grid>
  );
};

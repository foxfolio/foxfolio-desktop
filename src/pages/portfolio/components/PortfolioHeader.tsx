import { Grid, Typography } from '@material-ui/core';
import numeral from 'numeral';
import React from 'react';
import { SettingsType } from '../../../modules/settings.types';
import { PortfolioChange, PortfolioSum } from '../types/portfolio.types';
import { PriceChangeText } from './PriceChangeText';

interface Props {
  settings: SettingsType;
  sum: PortfolioSum;
  change: PortfolioChange;
}

export const PortfolioHeader = ({ settings, sum, change }: Props) => {
  return (
    <Grid container justify="center">
      <Grid item md={4} sm={12}>
        <Typography variant="title">
          {numeral(sum.fiat).format('0,0.00')} {settings.fiatCurrency} |&nbsp;
          <PriceChangeText change={change.fiat} />
        </Typography>
      </Grid>
      <Grid item md={4} sm={12}>
        <Typography variant="title" style={{ paddingLeft: 20 }}>
          {numeral(sum.crypto).format('0,0.0000')} {settings.cryptoCurrency} |{' '}
          <PriceChangeText change={change.crypto} />
        </Typography>
      </Grid>
    </Grid>
  );
};

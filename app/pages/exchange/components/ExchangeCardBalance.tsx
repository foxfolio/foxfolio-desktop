import { Card, CardContent, Grid, Typography, WithStyles } from 'material-ui';
import { StyleRulesCallback } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import React from 'react';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { Coinlist } from '../../../reducers/coinlist';

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    '&:last-child': {
      paddingBottom: theme.spacing.unit,
    },
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
  },
});

interface Props {
  coinlist: Coinlist;
  asset: string;
  balance: number;
}

export const ExchangeCardBalance = withStyles(styles)(
  ({ classes, coinlist, asset, balance }: Props & WithStyles) => (
    <Card elevation={2}>
      <CardContent className={classes.root}>
        <div className={classes.avatar}>
          <CurrencyAvatar asset={asset} coinlist={coinlist} />
        </div>
        <div className={classes.content}>
          <Grid container key={asset}>
            <Grid item xs={4}>
              <Typography>{asset}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{balance}</Typography>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  )
);

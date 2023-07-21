import { Card, CardContent, Grid, Typography, WithStyles } from '@material-ui/core';
import { StyleRulesCallback } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import format from 'format-number';
import React from 'react';
import { CurrencyAvatar } from '../../../../components/CurrencyAvatar';
import { Coinlist } from '../../../../modules/coinlist.types';
import { TickerEntry } from '../../../../modules/ticker.types';

const styles: StyleRulesCallback = theme => ({
  card: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    '&:last-child': {
      paddingBottom: theme.spacing.unit,
    },
  },
  avatarrow: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 3,
  },
  avatar: {
    width: 35,
    height: 35,
  },
  content: {
    flex: '1 1 auto',
  },
  right: {
    textAlign: 'right',
  },
});

interface Props {
  coinlist: Coinlist;
  tickerEntry: TickerEntry;
  asset: string;
  balance: number;
  fiatCurrency: string;
}

export const ExchangeCardBalance = withStyles(styles)(
  ({ classes, coinlist, tickerEntry, asset, balance, fiatCurrency }: Props & WithStyles) => (
    <Card elevation={2} square className={classes.card}>
      <CardContent className={classes.root}>
        <div className={classes.avatarrow}>
          <CurrencyAvatar asset={asset} coinlist={coinlist} classes={{ root: classes.avatar }} />
        </div>
        <div className={classes.content}>
          <Grid container key={asset}>
            <Grid item xs={3}>
              <Typography>{asset}</Typography>
            </Grid>
            <Grid item xs={4} className={classes.right}>
              <Typography>{format({ round: 6, padRight: 6 })(balance)}</Typography>
            </Grid>
            <Grid item xs={5} className={classes.right}>
              <Typography>
                {format({ round: 2, padRight: 2, suffix: ` ${fiatCurrency}` })(
                  balance * tickerEntry.PRICE
                )}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  )
);

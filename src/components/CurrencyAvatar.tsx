import { Avatar, WithStyles } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import { StyleRules } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { AccountBalance, HelpOutline } from '@material-ui/icons';
import React from 'react';

import { Coinlist } from '../modules/coinlist.types';
import { getFiatCurrencies } from '../utils/currencies';

const styles: StyleRules = {
  fiatAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
  root: {},
};

interface Props {
  asset: string;
  coinlist: Coinlist;
}

export const CurrencyAvatar = withStyles(styles)(
  ({ asset, coinlist, classes }: Props & WithStyles) => {
    if (coinlist[asset]) {
      return (
        <Avatar
          classes={{ root: classes.root }}
          src={`https://www.cryptocompare.com${coinlist[asset].ImageUrl}`}
        />
      );
    } else if (getFiatCurrencies().includes(asset)) {
      return (
        <Avatar className={classes.fiatAvatar} classes={{ root: classes.root }}>
          <AccountBalance />
        </Avatar>
      );
    }
    return (
      <Avatar classes={{ root: classes.root }}>
        <HelpOutline />
      </Avatar>
    );
  }
);

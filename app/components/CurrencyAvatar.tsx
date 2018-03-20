import { Avatar, WithStyles } from 'material-ui';
import { AccountBalance, HelpOutline } from 'material-ui-icons';
import green from 'material-ui/colors/green';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import React from 'react';

import { Coinlist } from '../reducers/coinlist';
import { getFiatCurrencies } from '../utils/currencies';

const styles: StyleRules = {
  fiatAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
};

interface Props {
  asset: string;
  coinlist: Coinlist;
}

export const CurrencyAvatar = withStyles(styles)(
  ({ asset, coinlist, classes }: Props & WithStyles) => {
    let avatar = (
      <Avatar>
        <HelpOutline />
      </Avatar>
    );
    if (coinlist[asset]) {
      avatar = <Avatar src={`https://www.cryptocompare.com${coinlist[asset].ImageUrl}`} />;
    } else if (getFiatCurrencies().includes(asset)) {
      avatar = (
        <Avatar className={classes.fiatAvatar}>
          <AccountBalance />
        </Avatar>
      );
    }
    return avatar;
  }
);

// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Typography, WithStyles } from 'material-ui';
import { StyleRulesCallback, withStyles } from 'material-ui/styles';
import green from 'material-ui/colors/green';

import { Wallet } from 'reducers/wallets';
import { Coinlist } from 'reducers/coinlist';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';

const styles: StyleRulesCallback = theme => ({
  card: {
    margin: '10px 0',
  },
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  fiatAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});

type Props = {
  coinlist: Coinlist,
  wallet: Wallet,
  onEdit: (wallet: Wallet) => void,
  onDelete: (wallet: Wallet) => void
};

export const WalletGridItem = withStyles(styles)(
  class extends Component<Props & WithStyles> {
    render() {
      const { classes, coinlist, wallet, onEdit, onDelete } = this.props;
      return (
        <Card className={classes.card}>
          <CardHeader
            avatar={<CurrencyAvatar asset={wallet.currency} coinlist={coinlist} fiatClass={classes.fiatAvatar}/>}
            title={
              <Typography type="headline" component="h2">
                {coinlist[wallet.currency] ? coinlist[wallet.currency].FullName : wallet.currency}
              </Typography>}
          />
          <CardContent>
            <Typography type="body1" className={classes.subheader}>
              {`Address: ${wallet.address}`}
              <br/>
              {`Quantity: ${wallet.quantity}`}
              <br/>
              {`Note: ${wallet.note ? wallet.note : ''}`}
            </Typography>
          </CardContent>
          <CardActions className="pull-right">
            <div className={classes.flexGrow}/>
            <Button dense color="default" onClick={() => onDelete(wallet)}>Delete</Button>
            <Button dense color="primary" onClick={() => onEdit(wallet)}>Edit</Button>
          </CardActions>
        </Card>
      );
    }
  }
);

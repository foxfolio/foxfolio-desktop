import { Card, CardContent, CardHeader, Typography, WithStyles } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import { StyleRulesCallback, withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { CardMenu } from '../../../components/CardMenu';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { Coinlist } from '../../../modules/coinlist.types';
import { Wallet } from '../../../modules/wallets.types';

const styles: StyleRulesCallback = theme => ({
  card: {
    margin: '10px 0',
  },
  content: {
    paddingTop: 0,
    paddingLeft: theme.spacing.unit * 9,
    '&:last-child': {
      paddingBottom: theme.spacing.unit,
    },
  },
  success: {
    color: green[500],
  },
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});

interface Props {
  coinlist: Coinlist;
  wallet: Wallet;
  onEdit: () => any;
  onDelete: () => any;
}

// TODO Show status when request in progress
function getSubheader(classes, wallet) {
  if (wallet.error) {
    return <Typography color="error">{wallet.error}</Typography>;
  } else if (wallet.address) {
    return <Typography className={classes.success}>Up to date</Typography>;
  }
  return 'Manual wallet';
}

export const WalletCard = withStyles(styles)(
  class extends Component<Props & WithStyles> {
    public render() {
      const { classes, coinlist, wallet, onEdit, onDelete } = this.props;
      return (
        <Card className={classes.card}>
          <CardHeader
            avatar={<CurrencyAvatar asset={wallet.currency} coinlist={coinlist} />}
            action={
              <CardMenu
                items={[
                  { key: 'edit', text: 'Edit', onClickListener: onEdit },
                  { key: 'delete', text: 'Delete', onClickListener: onDelete, className: 'error' },
                ]}
              />
            }
            subheader={getSubheader(classes, wallet)}
            title={
              <Typography variant="headline" component="h2">
                {coinlist[wallet.currency] ? coinlist[wallet.currency].FullName : wallet.currency}
              </Typography>
            }
          />
          <CardContent className={classes.content}>
            <Typography variant="title">{wallet.quantity}</Typography>
            <Typography variant="body1" className={classes.subheader}>
              {`${wallet.note ? `${wallet.note}` : ''}`}
            </Typography>
          </CardContent>
        </Card>
      );
    }
  }
);

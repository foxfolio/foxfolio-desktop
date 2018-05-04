import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  WithStyles,
} from 'material-ui';
import { StyleRulesCallback, withStyles } from 'material-ui/styles';
import React, { Component } from 'react';

import { CardMenu } from '../../../components/CardMenu';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { Coinlist } from '../../../reducers/coinlist';
import { Wallet } from '../../../reducers/wallets.types';

const styles: StyleRulesCallback = theme => ({
  card: {
    margin: '10px 0',
  },
  content: {
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2,
    },
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
            subheader={wallet.quantity}
            title={
              <Typography variant="headline" component="h2">
                {coinlist[wallet.currency] ? coinlist[wallet.currency].FullName : wallet.currency}
              </Typography>
            }
          />
          <CardContent className={classes.content}>
            <Typography variant="body1" className={classes.subheader}>
              {`Address: ${wallet.address}`}
              <br />
              {`Note: ${wallet.note ? wallet.note : ''}`}
            </Typography>
          </CardContent>
        </Card>
      );
    }
  }
);

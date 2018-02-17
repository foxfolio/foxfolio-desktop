import React, { Component } from 'react';
import { Button, Grid, Typography, WithStyles } from 'material-ui';
import { Add } from 'material-ui-icons';
import { StyleRulesCallback, withStyles } from 'material-ui/styles';
import { Coinlist } from 'reducers/coinlist';
import { WalletGridItem } from './WalletGridItem';
import WalletDialog from './WalletDialog';
import { Wallet } from 'reducers/wallets';

const styles: StyleRulesCallback = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

type Props = {
  coinlist: Coinlist,
  wallets: Wallet[],
  addWallet: (source: Wallet) => any,
  editWallet: (oldWallet: Wallet, newWallet: Wallet) => any,
  deleteWallet: (source: Wallet) => any
};

type State = {
  open: boolean,
  isNew: boolean,
  currentWallet: Wallet
};

export const WalletGrid = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    state = {
      open: false,
      isNew: true,
      currentWallet: { currency: '', address: '', quantity: 0 },
    };

    addDialog = () => {
      this.setState({ open: true, isNew: true, currentWallet: { currency: '', address: '', quantity: 0 } });
    };

    editDialog = (wallet: Wallet) => {
      this.setState({ open: true, isNew: false, currentWallet: wallet });
    };

    closeDialog = () => {
      this.setState({ open: false });
    };

    saveDialog = (wallet) => {
      if (this.state.isNew) {
        this.props.addWallet(wallet);
      } else {
        this.props.editWallet(this.state.currentWallet, wallet);
      }
      this.closeDialog();
    };

    render() {
      const { wallets, classes, coinlist, deleteWallet } = this.props;

      return (
        <div className="container">
          <Typography type="headline">Wallets</Typography>
          <Grid container>
            {wallets
              .sort((a, b) => a.address.localeCompare(b.address))
              .map(wallet => (
                <Grid item key={wallet.currency + wallet.address} sm={12} md={6}>
                  <WalletGridItem wallet={wallet} onEdit={this.editDialog} onDelete={deleteWallet} coinlist={coinlist}/>
                </Grid>
              ))}
          </Grid>
          <Button fab color="primary" aria-label="add" className={classes.button} onClick={this.addDialog}>
            <Add/>
          </Button>
          <WalletDialog
            open={this.state.open}
            wallet={this.state.currentWallet}
            close={this.closeDialog}
            save={this.saveDialog}
            coinlist={coinlist}
          />
        </div>
      );
    }
  }
);

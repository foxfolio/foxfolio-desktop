// @flow
import React, { Component } from 'react';
import { Button, Grid, Typography } from 'material-ui';
import { Add } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';
import type { Coinlist } from '../reducers/coinlist/types.d';
import WalletGridItem from './WalletGridItem';
import WalletDialog from './WalletDialog';
import type { Wallet } from '../reducers/wallets/types.d';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

type Props = {
  classes: any,
  coinlist: Coinlist,
  wallets: Wallet[],
  addWallet: (source: Wallet) => void,
  editWallet: (oldWallet: Wallet, newWallet: Wallet) => void,
  deleteWallet: (source: Wallet) => void
};

type State = {
  open: boolean,
  isNew: boolean,
  currentWallet: Wallet
};

class WalletGrid extends Component<Props, State> {
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
        />
      </div>
    );
  }
}

export default withStyles(styles)(WalletGrid);

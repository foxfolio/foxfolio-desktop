// @flow
import React, { Component } from 'react';
import { Button, Grid } from 'material-ui';
import { Add } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';
import WalletGridItem from './WalletGridItem';
import WalletDialog from './WalletDialog';
import type { walletType } from '../reducers/wallets';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

type Props = {
  classes: any,
  wallets: walletType[],
  addWallet: (source: walletType) => void,
  editWallet: (oldWallet: walletType, newWallet: walletType) => void
};

type State = {
  open: boolean,
  isNew: boolean,
  currentWallet: walletType
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

  editDialog = (wallet: walletType) => {
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
    const { wallets, classes } = this.props;

    return (
      <div className="container">
        <h1>Wallets</h1>
        <Grid container>
          {wallets
            .sort((a, b) => a.address.localeCompare(b.address))
            .map(wallet => (
              <Grid item key={wallet.currency + wallet.address} sm={12} md={6}>
                <WalletGridItem wallet={wallet} onEdit={this.editDialog}/>
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

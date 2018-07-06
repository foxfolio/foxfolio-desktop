import { Button, Grid, Typography, WithStyles } from '@material-ui/core';
import { StyleRulesCallback, withStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import React, { Component } from 'react';
import { Coinlist } from '../../../reducers/coinlist';
import { Wallet } from '../../../reducers/wallets.types';
import { WalletCard } from './WalletCard';
import WalletDialog from './WalletDialog';

const styles: StyleRulesCallback = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'fixed',
    right: 40,
    bottom: 40,
  },
});

interface Props {
  coinlist: Coinlist;
  wallets: Wallet[];
  addWallet: (source: Wallet) => any;
  editWallet: (oldWallet: Wallet, newWallet: Wallet) => any;
  deleteWallet: (source: Wallet) => any;
}

interface State {
  open: boolean;
  isNew: boolean;
  currentWallet: Wallet;
}

export const WalletGrid = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    public state = {
      open: false,
      isNew: true,
      currentWallet: { currency: '', address: '', quantity: 0 },
    };

    public addDialog = () => {
      this.setState({
        open: true,
        isNew: true,
        currentWallet: { currency: '', address: '', quantity: 0 },
      });
    };

    public editDialog = (wallet: Wallet) => {
      this.setState({ open: true, isNew: false, currentWallet: wallet });
    };

    public closeDialog = () => {
      this.setState({ open: false });
    };

    public saveDialog = (wallet: Wallet) => {
      if (this.state.isNew) {
        this.props.addWallet(wallet);
      } else {
        this.props.editWallet(this.state.currentWallet, wallet);
      }
      this.closeDialog();
    };

    public render() {
      const { wallets, classes, coinlist, deleteWallet } = this.props;

      return (
        <div className="container">
          <Typography variant="headline">Wallets</Typography>
          <Grid container spacing={16}>
            {wallets.sort((a, b) => a.address.localeCompare(b.address)).map(wallet => (
              <Grid item key={wallet.currency + wallet.address} sm={12} md={8} lg={6}>
                <WalletCard
                  wallet={wallet}
                  onEdit={() => this.editDialog(wallet)}
                  onDelete={() => deleteWallet(wallet)}
                  coinlist={coinlist}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="fab"
            color="primary"
            aria-label="add"
            className={classes.button}
            onClick={this.addDialog}
          >
            <Add />
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

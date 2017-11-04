import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, } from 'material-ui';
import type { walletType } from '../reducers/wallets';

type Props = {
  wallet: walletType,
  open: boolean,
  close: () => void,
  save: (source: walletType) => void
};

export default class WalletDialog extends Component<Props> {
  state = {
    currency: '',
    address: '',
    quantity: 0,
    currencyValid: true,
    addressValid: true,
    quantityValid: true,
    noteValid: true,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      currency: nextProps.wallet.currency,
      address: nextProps.wallet.address,
      quantity: nextProps.wallet.quantity,
      note: nextProps.wallet.note,
    });
  }

  save = () => {
    this.props.save({
      currency: this.state.currency,
      address: this.state.address,
      quantity: parseFloat(this.state.quantity),
      note: this.state.note,
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { open, close } = this.props;

    return (
      <Dialog
        title="New Wallet"
        open={open}
        onRequestClose={close}
      >
        <DialogTitle>New wallet</DialogTitle>
        <DialogContent>
          <form autoComplete="off">
            <TextField
              label="Currency"
              id="currency"
              value={this.state.currency}
              onChange={this.handleChange('currency')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              id="address"
              value={this.state.address}
              onChange={this.handleChange('address')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleChange('quantity')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Note"
              id="note"
              value={this.state.note}
              onChange={this.handleChange('note')}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={close} color="primary">
                Cancel
              </Button>
              <Button onClick={this.save} color="primary">
                Ok
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, } from 'material-ui';
import type { Wallet } from '../../../reducers/wallets/types.d';

type Props = {
  wallet: Wallet,
  open: boolean,
  close: () => void,
  save: (source: Wallet) => void
};

export default class WalletDialog extends Component<Props, Wallet> {
  state = {
    currency: '',
    address: '',
    quantity: 0,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        currency: nextProps.wallet.currency,
        address: nextProps.wallet.address,
        quantity: nextProps.wallet.quantity,
        note: nextProps.wallet.note,
      });
    }
  }

  save = (event: Event) => {
    event.preventDefault();
    this.props.save({
      currency: this.state.currency,
      address: this.state.address,
      quantity: parseFloat(this.state.quantity),
      note: this.state.note ? this.state.note : '',
    });
  };

  handleChange = (name: string) => (event: any) => {
    this.setState({ [name]: event.target.value });
  };

  render(): Node {
    const { open, close } = this.props;

    return (
      <Dialog
        title="New Wallet"
        open={open}
        onClose={close}
      >
        <DialogTitle>New wallet</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={this.save}>
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
              value={this.state.note ? this.state.note : ''}
              onChange={this.handleChange('note')}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={close} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Ok
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

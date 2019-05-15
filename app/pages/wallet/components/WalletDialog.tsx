import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import React, { Component, FormEvent } from 'react';
import { Autocomplete } from '../../../components/Autocomplete';
import { Coinlist } from '../../../modules/coinlist.types';
import { supportsAutoUpdate } from '../../../modules/wallets';
import { Wallet } from '../../../modules/wallets.types';

interface Props {
  wallet: Wallet;
  coinlist: Coinlist;
  open: boolean;
  close: () => void;
  save: (source: Wallet) => void;
}

interface StringWallet {
  id: string;
  currency: string;
  quantity: string;
  address?: string;
  note?: string;
}

export default class WalletDialog extends Component<Props, StringWallet> {
  public state: StringWallet = {
    id: '',
    currency: '',
    quantity: '',
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        id: nextProps.wallet.id,
        currency: nextProps.wallet.currency,
        quantity: nextProps.wallet.quantity.toString(),
        address: nextProps.wallet.address,
        note: nextProps.wallet.note,
      });
    }
  }

  public save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.save({
      id: this.state.id,
      currency: this.state.currency,
      quantity: parseFloat(this.state.quantity),
      address: this.state.address ? this.state.address : '',
      note: this.state.note ? this.state.note : '',
    });
  };

  public changeCurrency = (fullName: string) => {
    const extractSymbol = fullName.match(/\(([^)]+)\)/);
    const symbol = extractSymbol && extractSymbol.length > 1 ? extractSymbol[1] : '';
    this.setState({ currency: symbol });
  };

  public handleChange = (name: keyof Wallet) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (name === 'quantity') {
      this.setState({ quantity: event.target.value });
    } else {
      this.setState({ [name]: event.target.value } as any);
    }
  };

  public render() {
    const { open, close, coinlist } = this.props;

    return (
      <Dialog title="New Wallet" open={open} onClose={close}>
        <DialogTitle>New wallet</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={this.save}>
            <Autocomplete
              label="Currency"
              id="currency"
              onChange={this.changeCurrency}
              value={this.state.currency}
              items={Object.values(coinlist)
                .sort((a, b) => parseInt(a.SortOrder, 10) - parseInt(b.SortOrder, 10))
                .map(coin => coin.FullName)}
            />
            <TextField
              label={`Address (for automatic updates${
                !supportsAutoUpdate(this.state.currency) ? ', currently only BTC and ETH' : ''
              })`}
              id="address"
              value={this.state.address}
              onChange={this.handleChange('address')}
              disabled={!supportsAutoUpdate(this.state.currency)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleChange('quantity')}
              disabled={!!this.state.address}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Note (optional)"
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

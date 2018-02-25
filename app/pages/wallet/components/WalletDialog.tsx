import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from 'material-ui';
import React, { Component, FormEvent } from 'react';
import { Autocomplete } from '../../../components/Autocomplete';
import { Coinlist } from '../../../reducers/coinlist';
import { Wallet } from '../../../reducers/wallets.types';

interface Props {
  wallet: Wallet;
  coinlist: Coinlist;
  open: boolean;
  close: () => void;
  save: (source: Wallet) => void;
}

interface StringWallet {
  currency: string;
  quantity: string;
  address: string;
  note?: string;
}

export default class WalletDialog extends Component<Props, StringWallet> {
  public state: StringWallet = {
    currency: '',
    address: '',
    quantity: '',
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        currency: nextProps.wallet.currency,
        address: nextProps.wallet.address,
        quantity: nextProps.wallet.quantity.toString(),
        note: nextProps.wallet.note,
      });
    }
  }

  public save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.save({
      currency: this.state.currency,
      address: this.state.address,
      quantity: parseFloat(this.state.quantity),
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
              items={Object.keys(coinlist).map(key => coinlist[key].FullName)}
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
              type="number"
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  WithStyles,
} from '@material-ui/core';
import { StyleRules, withStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import React, { Component, FormEvent } from 'react';
import { Trade } from '../../../reducers/exchanges.types';
import { DialogConfig } from '../../exchange/components/ExchangeDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  saveTrade: (trade: Trade) => void;
  config?: DialogConfig<Trade>;
}

type State = Trade;

const emptyTrade: Trade = {
  id: '',
  amount: 0,
  cost: 0,
  datetime: new Date(),
  price: 0,
  side: 'buy',
  symbol: '/',
  timestamp: Date.now(),
};

const styles: StyleRules = {
  paper: {
    width: 500,
  },
};

export const TradeDialog = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    public state: State = emptyTrade;

    public componentWillReceiveProps(nextProps: Props): void {
      if (this.props.open !== nextProps.open && nextProps.config) {
        if (nextProps.config.action === 'edit') {
          return this.setState(nextProps.config.item);
        }
        this.setState(emptyTrade);
      }
    }

    public handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        ...this.state,
        [name]: event.target.value,
      });
    };

    public handleSymbolChange = (part: 'from' | 'to') => (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value;
      this.setState({
        ...this.state,
        symbol:
          part === 'from'
            ? `${value}/${this.state.symbol.split('/' || '')[1]}`
            : `${this.state.symbol.split('/')[0] || ''}/${value}`,
      });
    };

    public handleNumericChange = (name: keyof State) => (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      this.setState({
        ...this.state,
        [name]: parseFloat(event.target.value),
      });
    };

    public handleDateChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        ...this.state,
        datetime: dayjs(event.target.value).toDate(),
        timestamp: dayjs(event.target.value).valueOf(),
      });
    };

    public handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      this.props.saveTrade({ ...this.state, cost: this.state.price * this.state.amount });
    };

    public createDialog(config: DialogConfig<Trade>) {
      return (
        <div>
          <DialogTitle>{config.action === 'add' ? 'Add' : 'Edit '} exchange </DialogTitle>
          <DialogContent>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
              <div style={{ minHeight: 250 }}>
                <TextField
                  label="Side"
                  id="side"
                  value={this.state.side}
                  onChange={this.handleChange('side')}
                  fullWidth
                  margin="normal"
                  select
                >
                  <MenuItem value="buy">buy</MenuItem>
                  <MenuItem value="sell">sell</MenuItem>
                </TextField>
                <Grid container>
                  <Grid item xs={6}>
                    <TextField
                      label="From"
                      id="from"
                      value={this.state.symbol.split('/')[0] || ''}
                      onChange={this.handleSymbolChange('from')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="To"
                      id="to"
                      value={this.state.symbol.split('/')[1] || ''}
                      onChange={this.handleSymbolChange('to')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Datetime"
                  id="datetime"
                  value={dayjs(this.state.datetime).toISOString()}
                  onChange={this.handleDateChange()}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Amount"
                  id="amount"
                  type="number"
                  value={this.state.amount}
                  onChange={this.handleNumericChange('amount')}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Price"
                  id="price"
                  type="number"
                  value={this.state.price}
                  onChange={this.handleNumericChange('price')}
                  fullWidth
                  margin="normal"
                />
              </div>
              <DialogActions>
                <Button onClick={this.props.onClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Ok
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </div>
      );
    }

    public render() {
      const { open, onClose, config, classes } = this.props;

      return (
        <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
          {config ? this.createDialog(config) : ''}
        </Dialog>
      );
    }
  }
);

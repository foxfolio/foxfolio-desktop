// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import ccxt from 'ccxt';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';

import type { Exchange } from '../../../reducers/exchanges/types.d';

export type DialogConfig =
  | AddConfig
  | EditConfig;

type AddConfig = {
  action: 'add'
};

type EditConfig = {
  action: 'edit',
  exchange: Exchange
};

type Props = {
  open: boolean,
  onClose: () => void,
  saveExchange: (exchange: Exchange) => void,
  config?: DialogConfig,
  classes: Object
};

type State = {
  exchange: $Shape<Exchange>
};

const emptyExchange: Exchange = {
  id: '',
  type: '',
  credentials: {
    apiKey: '',
    secret: '',
  },
  balances: {},
  ledger: [],
  trades: [],
};

class ExchangeDialog_ extends Component<Props, State> {
  state = {
    exchange: emptyExchange,
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.open !== nextProps.open && nextProps.config) {
      if (nextProps.config.action === 'edit') {
        return this.setState({ exchange: nextProps.config.exchange });
      }
      this.setState({ exchange: emptyExchange });
    }
  }

  changeExchange = (event: Object) => {
    this.setState({ exchange: { ...this.state.exchange, type: event.target.value } });
  };

  changeCredentials = (name: string) => (event: Object) => {
    this.setState({
      exchange: {
        ...this.state.exchange,
        credentials: { ...this.state.exchange.credentials, [name]: event.target.value },
      },
    });
  };

  handleSubmit = (event: Object) => {
    event.preventDefault();
    this.props.saveExchange(this.state.exchange);
  };

  createDialog(config: DialogConfig): Node {
    const { requiredCredentials } = this.state.exchange.type !== '' ? new ccxt[this.state.exchange.type]() : {};
    return (
      <div>
        <DialogTitle>{config.action === 'add' ? 'Add' : 'Edit '} exchange </DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <TextField
              label="Exchange"
              id="exchange"
              value={this.state.exchange.type}
              onChange={this.changeExchange}
              fullWidth
              margin="normal"
              select
            >
              {ccxt.exchanges.map(exchange => (
                <MenuItem key={exchange} value={exchange}>
                  {exchange}
                </MenuItem>
              ))}
            </TextField>
            {this.state.exchange.type !== ''
              ? (
                <div>
                  {requiredCredentials.apiKey
                    ? <TextField
                      label="API Key"
                      id="apiKey"
                      value={this.state.exchange.credentials.apiKey}
                      onChange={this.changeCredentials('apiKey')}
                      fullWidth
                      margin="normal"
                    /> : ''}
                  {requiredCredentials.secret
                    ? <TextField
                      label="Secret"
                      id="secret"
                      value={this.state.exchange.credentials.secret}
                      onChange={this.changeCredentials('secret')}
                      fullWidth
                      margin="normal"
                    /> : ''}
                  {requiredCredentials.uid
                    ? <TextField
                      label="User ID"
                      id="uid"
                      value={this.state.exchange.credentials.uid}
                      onChange={this.changeCredentials('uid')}
                      fullWidth
                      margin="normal"
                    /> : ''}
                  {requiredCredentials.login
                    ? <TextField
                      label="Login"
                      id="login"
                      value={this.state.exchange.credentials.login}
                      onChange={this.changeCredentials('login')}
                      fullWidth
                      margin="normal"
                    /> : ''}
                  {requiredCredentials.password
                    ? <TextField
                      label="Password"
                      id="password"
                      value={this.state.exchange.credentials.password}
                      onChange={this.changeCredentials('password')}
                      fullWidth
                      margin="normal"
                    /> : ''}
                </div>
              )
              : ''}
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

  render(): Node {
    const { open, onClose, config, classes } = this.props;

    return (
      <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
        {config
          ? this.createDialog(config)
          : ''}
      </Dialog>
    );
  }
}

const styles = {
  paper: {
    width: 500,
  },
};

export const ExchangeDialog = withStyles(styles)(ExchangeDialog_);

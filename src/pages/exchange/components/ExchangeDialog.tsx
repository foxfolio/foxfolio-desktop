import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  WithStyles,
} from '@material-ui/core';
import { StyleRules, withStyles } from '@material-ui/core/styles';
import ccxt from 'ccxt';
import React, { Component, FormEvent } from 'react';

import { Autocomplete } from '../../../components/Autocomplete';
import { Exchange } from '../../../modules/exchanges.types';

export type DialogConfig<T> = AddConfig | EditConfig<T>;

interface AddConfig {
  action: 'add';
}

interface EditConfig<T> {
  action: 'edit';
  item: T;
}

interface Props {
  open: boolean;
  onClose: () => void;
  saveExchange: (exchange: Exchange) => void;
  config?: DialogConfig<Exchange>;
}

interface State {
  exchange: Exchange;
}

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

const styles: StyleRules = {
  paper: {
    width: 500,
  },
};

export const ExchangeDialog = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    public state: State = {
      exchange: emptyExchange,
    };

    public componentWillReceiveProps(nextProps: Props): void {
      if (this.props.open !== nextProps.open && nextProps.config) {
        if (nextProps.config.action === 'edit') {
          return this.setState({ exchange: nextProps.config.item });
        }
        this.setState({ exchange: emptyExchange });
      }
    }

    public changeExchange = (type: string) => {
      this.setState({ exchange: { ...this.state.exchange, type } });
    };

    public changeCredentials = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        exchange: {
          ...this.state.exchange,
          credentials: { ...this.state.exchange.credentials, [name]: event.target.value },
        },
      });
    };

    public handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      this.props.saveExchange(this.state.exchange);
    };

    public createDialog(config: DialogConfig<Exchange>) {
      const { requiredCredentials } =
        this.state.exchange.type !== ''
          ? new ccxt[this.state.exchange.type]()
          : { requiredCredentials: {} };
      return (
        <div>
          <DialogTitle>{config.action === 'add' ? 'Add' : 'Edit '} exchange </DialogTitle>
          <DialogContent>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
              <div style={{ minHeight: 250 }}>
                <Autocomplete
                  label="Exchange"
                  id="exchange"
                  onChange={this.changeExchange}
                  value={this.state.exchange.type}
                  items={ccxt.exchanges.filter(exchange => exchange.charAt(0) !== '_')}
                />
                {this.state.exchange.type !== '' ? (
                  <div>
                    {requiredCredentials.apiKey ? (
                      <TextField
                        label="API Key"
                        id="apiKey"
                        value={this.state.exchange.credentials.apiKey}
                        onChange={this.changeCredentials('apiKey')}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      ''
                    )}
                    {requiredCredentials.secret ? (
                      <TextField
                        label="Secret"
                        id="secret"
                        value={this.state.exchange.credentials.secret}
                        onChange={this.changeCredentials('secret')}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      ''
                    )}
                    {requiredCredentials.uid ? (
                      <TextField
                        label="User ID"
                        id="uid"
                        value={this.state.exchange.credentials.uid}
                        onChange={this.changeCredentials('uid')}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      ''
                    )}
                    {requiredCredentials.login ? (
                      <TextField
                        label="Login"
                        id="login"
                        value={this.state.exchange.credentials.login}
                        onChange={this.changeCredentials('login')}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      ''
                    )}
                    {requiredCredentials.password ? (
                      <TextField
                        label="Password"
                        id="password"
                        value={this.state.exchange.credentials.password}
                        onChange={this.changeCredentials('password')}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  ''
                )}
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

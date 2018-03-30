import _ from 'lodash';
import { Button, Grid, Typography, WithStyles } from 'material-ui';
import { Add } from 'material-ui-icons';
import { StyleRulesCallback, withStyles } from 'material-ui/styles';
import React, { Component } from 'react';
import { Coinlist } from '../../../reducers/coinlist';
import { Exchange, ExchangeCredentials, Exchanges, Trade } from '../../../reducers/exchanges.types';
import { SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import { ExchangeCard } from './ExchangeCard/ExchangeCard';
import { DialogConfig, ExchangeDialog } from './ExchangeDialog';

const styles: StyleRulesCallback = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'fixed',
    right: 40,
    bottom: 40,
  },
  cardcontainer: {
    minWidth: 450,
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export interface StateProps {
  coinlist: Coinlist;
  exchanges: Exchanges;
  ticker: Ticker;
  settings: SettingsType;
}

export interface DispatchProps {
  addExchange: (type: string, credentials: ExchangeCredentials) => any;
  updateExchangeCredentials: (id: string, credentials: ExchangeCredentials) => any;
  updateExchangeTrades: (id: string, trades: Trade[]) => any;
  deleteExchange: (id: string) => any;
}

interface State {
  open: boolean;
  dialogConfig?: DialogConfig<Exchange>;
}

export const ExchangeGrid = withStyles(styles)(
  class extends Component<StateProps & DispatchProps & WithStyles, State> {
    public state: State = {
      open: false,
    };

    public handleEdit = (exchange: Exchange) => () => {
      this.setState({ open: true, dialogConfig: { action: 'edit', item: exchange } });
    };

    public handleAdd = () => {
      this.setState({ open: true, dialogConfig: { action: 'add' } });
    };

    public saveExchange = (exchange: Exchange) => {
      if (this.state.dialogConfig && this.state.dialogConfig.action === 'edit') {
        this.props.updateExchangeCredentials(exchange.id, exchange.credentials);
      } else {
        this.props.addExchange(exchange.type, exchange.credentials);
      }
      this.setState({ open: false });
    };

    public handleDelete = (exchange: Exchange) => () => {
      this.props.deleteExchange(exchange.id);
    };

    public handleClose = () => {
      this.setState({ open: false });
    };

    public render() {
      const { exchanges, classes, coinlist, ticker, settings } = this.props;

      return (
        <div className="container">
          <Typography type="headline">Exchanges</Typography>
          <div className={classes.cardcontainer}>
            {_.values(exchanges).map(exchange => (
              <ExchangeCard
                coinlist={coinlist}
                exchange={exchange}
                ticker={ticker}
                settings={settings}
                onEdit={this.handleEdit(exchange)}
                onDelete={this.handleDelete(exchange)}
              />
            ))}
          </div>
          <Button
            fab
            color="primary"
            aria-label="add"
            className={classes.button}
            onClick={this.handleAdd}
          >
            <Add />
          </Button>
          <ExchangeDialog
            open={this.state.open}
            config={this.state.dialogConfig ? this.state.dialogConfig : undefined}
            onClose={this.handleClose}
            saveExchange={this.saveExchange}
          />
        </div>
      );
    }
  }
);

import { Button, Grid, Typography, WithStyles } from 'material-ui';
import { Add } from 'material-ui-icons';
import { StyleRulesCallback, withStyles } from 'material-ui/styles';
import { values } from 'ramda';
import React, { Component } from 'react';

import { Exchange, ExchangeCredentials, Exchanges, Trade } from '../../../reducers/exchanges.types';
import { ExchangeCard } from './ExchangeCard';
import { DialogConfig, ExchangeDialog } from './ExchangeDialog';

const styles: StyleRulesCallback = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

export interface StateProps {
  exchanges: Exchanges;
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

    public handleEdit = exchange => () => {
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

    public handleDelete = exchange => () => {
      this.props.deleteExchange(exchange.id);
    };

    public handleClose = () => {
      this.setState({ open: false });
    };

    public render() {
      const { exchanges, classes } = this.props;

      return (
        <div className="container">
          <Typography type="headline">Exchanges</Typography>
          <Grid container>
            {values(exchanges).map(exchange => (
              <Grid item key={exchange.id} sm={12} md={6}>
                <ExchangeCard
                  exchange={exchange}
                  onEdit={this.handleEdit(exchange)}
                  onDelete={this.handleDelete(exchange)}
                />
              </Grid>
            ))}
          </Grid>
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

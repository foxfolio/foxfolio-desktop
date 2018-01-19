// @flow
import React, { Component } from 'react';
import { values } from 'ramda';
import { Button, Grid, Typography } from 'material-ui';
import { Add } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

import type { Exchange, ExchangeCredentials, Exchanges } from '../../../reducers/exchanges/types.d';
import { ExchangeCard } from './ExchangeCard';
import type { DialogConfig } from './ExchangeDialog';
import { ExchangeDialog } from './ExchangeDialog';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

type Props = {
  classes: any,
  exchanges: Exchanges,
  addExchange: (type: string, credentials: ExchangeCredentials) => void,
  updateExchangeCredentials: (id: string, credentials: ExchangeCredentials) => void,
  deleteExchange: (id: string) => void
};

type State = {
  open: boolean,
  dialogConfig?: DialogConfig
};

class ExchangeGrid_ extends Component<Props, State> {
  state = {
    open: false,
  };

  handleEdit = exchange => () => {
    this.setState({ open: true, dialogConfig: { action: 'edit', exchange } });
  };

  handleAdd = () => {
    this.setState({ open: true, dialogConfig: { action: 'add' } });
  };

  saveExchange = (exchange: Exchange) => {
    if (this.state.dialogConfig && this.state.dialogConfig.action === 'edit') {
      this.props.updateExchangeCredentials(exchange.id, exchange.credentials);
    } else {
      this.props.addExchange(exchange.type, exchange.credentials);
    }
    this.setState({ open: false });
  };

  handleDelete = exchange => () => {
    this.props.deleteExchange(exchange.id);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
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
        <Button fab color="primary" aria-label="add" className={classes.button} onClick={this.handleAdd}>
          <Add/>
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

export const ExchangeGrid = withStyles(styles)(ExchangeGrid_);

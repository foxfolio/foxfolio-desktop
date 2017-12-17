// @flow
import React, { Component } from 'react';
import { values } from 'ramda';
import { Button, Grid, Typography } from 'material-ui';
import { Add } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

import type { Exchanges } from '../reducers/exchanges/types.d';
import { ExchangeCard } from './ExchangeCard';

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
  exchanges: Exchanges
};

class ExchangeGrid_ extends Component<Props> {
  render() {
    const { exchanges, classes } = this.props;

    return (
      <div className="container">
        <Typography type="headline">Exchanges</Typography>
        <Grid container>
          {values(exchanges).map(exchange => (
            <Grid item key={exchange.id} sm={12} md={6}>
              <ExchangeCard exchange={exchange}/>
            </Grid>
          ))}
        </Grid>
        <Button fab color="primary" aria-label="add" className={classes.button}>
          <Add/>
        </Button>
      </div>
    );
  }
}

export const ExchangeGrid = withStyles(styles)(ExchangeGrid_);

// @flow
import React, { Component } from 'react';
import {
  Button, Card, CardActions, CardContent, Collapse, Divider, Grid, LinearProgress,
  Typography,
} from 'material-ui';
import green from 'material-ui/colors/green';
import { withStyles } from 'material-ui/styles';

import type { Exchange } from '../../../reducers/exchanges/types.d';

const styles = theme => ({
  card: {
    margin: '10px 0',
  },
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  success: {
    color: green[500],
  },
  error: {
    color: theme.palette.error[500],
  },
  collapse: {
    padding: 16,
  },
});

type Props = {
  classes: any,
  exchange: Exchange,
  onEdit: () => void,
  onDelete: () => void
};

type State = {
  expanded: boolean
};

const hasOpenRequests = exchange => exchange.openRequests && exchange.openRequests > 0;

class ExchangeCard_ extends Component<Props, State> {
  state = {
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes, exchange, onEdit, onDelete } = this.props;

    let status = <span className={classes.success}>OK</span>;
    if (exchange.error) {
      status = <span className={classes.error}>{exchange.error}</span>;
    } else if (hasOpenRequests(exchange)) {
      status = <span>Fetching transactions</span>;
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2">
            {exchange.type}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Key: ${exchange.credentials.apiKey.substring(0, 20)}...`}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            Status: {status}
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense onClick={this.handleExpandClick}>
            {this.state.expanded ? 'Hide' : 'Show'} balances
          </Button>
          <div className={classes.flexGrow}/>
          <Button dense className={classes.error} onClick={onDelete}>Delete</Button>
          <Button dense onClick={onEdit}>Edit</Button>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Divider/>
          <div className={classes.collapse}>
            {Object.keys(exchange.balances).sort().map(asset => (
              <Grid container key={asset}>
                <Grid item xs={4}><Typography>{asset}</Typography></Grid>
                <Grid item xs={8}><Typography>{exchange.balances[asset]}</Typography></Grid>
              </Grid>
            ))}
          </div>
        </Collapse>
        {hasOpenRequests(exchange) ? <LinearProgress/> : ''}
      </Card>
    );
  }
}

export const ExchangeCard = withStyles(styles)(ExchangeCard_);

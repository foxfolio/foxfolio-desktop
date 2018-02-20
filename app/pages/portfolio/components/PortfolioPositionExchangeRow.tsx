import { Avatar, Card, CardContent, Grid, Typography, withStyles } from 'material-ui';
import { TrendingUp } from 'material-ui-icons';
import { StyleRulesCallback } from 'material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { Exchanges } from '../../../reducers/exchanges.types';

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.palette.text.secondary,
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
    margin: 5,
    width: 30,
    height: 30,
  },
  content: {
    flex: '1 1 auto',
  },
  right: {
    textAlign: 'right',
  },
});

interface Props {
  asset: string;
  balance: number;
  exchangeKey: string;
  exchanges: Exchanges;
}

const styledComponent = withStyles(styles)<Props>(
  ({ asset, balance, classes, exchangeKey, exchanges }) => (
    <Card>
      <CardContent className={classes.root}>
        <div>
          <Avatar className={classes.avatar}>
            <TrendingUp />
          </Avatar>
        </div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={3}>
              <Typography type="body2" component="span">
                {exchanges[exchangeKey].type}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography>{`${balance.toPrecision(5)} ${asset}`}</Typography>
            </Grid>
          </Grid>
        </div>
        <div style={{ width: 48 }} />
      </CardContent>
    </Card>
  )
);

const mapStateToProps = state => ({
  exchanges: state.exchanges,
});

export const PortfolioPositionExchangeRow = connect(mapStateToProps)(styledComponent);

// @flow
import React from 'react';
import { Avatar, Card, CardContent, Grid, Typography, withStyles } from 'material-ui';
import { TrendingUp } from 'material-ui-icons';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';
import type { Exchanges } from '../../reducers/exchanges/types.d';

const styles = theme => ({
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

type Props = {
  asset: string,
  balance: number,
  classes: Object,
  exchangeKey: string,
  exchanges: Exchanges
};

function PortfolioPositionExchangeRow({ asset, balance, classes, exchangeKey, exchanges }: Props) {
  return (
    <Card>
      <CardContent className={classes.root}>
        <div>
          <Avatar className={classes.avatar}>
            <TrendingUp/>
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
              <Typography>
                {`${balance.toPrecision(5)} ${asset}`}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div style={{ width: 48 }}/>
      </CardContent>
    </Card>
  );
}

const styledComponent = withStyles(styles)(PortfolioPositionExchangeRow);

const mapStateToProps: MapStateToProps<*, *, *> = (state) => ({
  exchanges: state.exchanges,
});

export default connect(mapStateToProps)(styledComponent);

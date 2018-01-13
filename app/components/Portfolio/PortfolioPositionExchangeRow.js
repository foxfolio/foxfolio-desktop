// @flow
import React from 'react';
import { Avatar, Card, CardContent, Grid, Typography, withStyles } from 'material-ui';
import { TrendingUp } from 'material-ui-icons';

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
  exchange: string,
  classes: Object
};

function PortfolioPositionExchangeRow({ asset, balance, exchange, classes }: Props) {
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
                {exchange}
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

export default withStyles(styles)(PortfolioPositionExchangeRow);

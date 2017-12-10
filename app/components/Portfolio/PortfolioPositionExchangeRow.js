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
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
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
    <Card style={{ paddingLeft: 50 }}>
      <CardContent className={classes.root}>
        <div>
          <Avatar className={classes.avatar}>
            <TrendingUp/>
          </Avatar>
        </div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={2}>
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
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(PortfolioPositionExchangeRow);

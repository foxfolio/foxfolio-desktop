// @flow
import React from 'react';
import { Card, CardContent, Grid, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';

export const styles = (theme: Object) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '12px !important',
    paddingBottom: '12px !important',
  },
  avatar: {
    flex: '0 0 auto',
    width: 40,
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
  },
  collapseButton: {
    flex: '0 0 auto',
    width: 48,
  },
  right: {
    textAlign: 'right',
  },
  interval: {
    fontSize: 12,
    color: 'grey',
  },
});

type Props = {
  classes: any
};

const header = ({ classes }: Props) => (
  <Card>
    <CardContent className={classes.root}>
      <div className={classes.avatar}/>
      <div className={classes.content}>
        <Grid container>
          <Grid item xs={3}>
            <Typography type="title">Coin</Typography>
          </Grid>
          <Grid item xs={2} className={classes.right}>
            <Typography type="title">Quantity</Typography>
          </Grid>
          <Grid item xs={3} className={classes.right}>
            <Typography type="title">Price</Typography>
          </Grid>
          <Grid item xs={2} className={classes.right}>
            <Typography type="title">Change</Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.collapseButton}/>
    </CardContent>
  </Card>
);

export const PortfolioPositionHeader = withStyles(styles)(header);

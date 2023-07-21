import {
  Avatar,
  Card,
  CardContent,
  createStyles,
  Grid,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { TrendingUp } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../../../modules';
import { Exchanges } from '../../../../modules/exchanges.types';
import { getExchanges } from '../../../../selectors/selectGlobalState';

const styles = (theme: Theme) =>
  createStyles({
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

interface Props extends WithStyles<typeof styles> {
  asset: string;
  balance: number;
  exchangeKey: string;
  exchanges: Exchanges;
}

const styledComponent = withStyles(styles)(
  ({ asset, balance, classes, exchangeKey, exchanges }: Props) => (
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
              <Typography variant="body2" component="span">
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

const mapStateToProps = (state: GlobalState) => ({
  exchanges: getExchanges(state),
});

export const PortfolioPositionExchangeRow = connect(mapStateToProps)(styledComponent);

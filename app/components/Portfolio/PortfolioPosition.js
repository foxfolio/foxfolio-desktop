// @flow
import type { Node } from 'react';
import R from 'ramda';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Avatar, Card, CardContent, Grid, IconButton, Typography } from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import { withStyles } from 'material-ui/styles';
import { ExpandMore } from 'material-ui-icons';
import PriceChangeText from '../PriceChangeText';
import PortfolioPositionExchangeRow from './PortfolioPositionExchangeRow';
import PortfolioPositionWalletRow from './PortfolioPositionWalletRow';

export const styles = (theme: Object) => ({
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
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  right: {
    textAlign: 'right',
  },
});

type Props = {
  asset: string,
  coinlist: Object,
  ticker: Object,
  portfolio: { total: number, exchanges: { [id: string]: number }, wallets: number },
  classes: any,
  fiatCurrency: string
};

type State = {
  expanded: boolean
};

class PortfolioPosition extends Component<Props, State> {
  state = {
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  rowCard(avatar: Node) {
    const { asset, portfolio, classes, coinlist, ticker, fiatCurrency } = this.props;
    const quantity = portfolio.total;
    return (
      <CardContent className={classes.root} onClick={this.handleExpandClick}>
        <div className={classes.avatar}>{avatar}</div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={3}>
              <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
                {coinlist[asset].FullName}
              </Typography>
              <Typography
                type="body2"
                component="span"
                color="secondary"
              >
                {quantity.toPrecision(5)}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
                {`${(ticker[asset][fiatCurrency].PRICE * quantity).toFixed(2)}  €`}
              </Typography>
              <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
                {`${(ticker[asset].BTC.PRICE * quantity).toPrecision(5)} BTC`}
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.right}>
              <Typography
                type="body2"
                component="span"
                color={quantity > 0 ? 'default' : 'secondary'}
              >
                {`${(ticker[asset][fiatCurrency].PRICE).toPrecision(5)} €`}
              </Typography>
              <Typography
                type="body2"
                component="span"
                color={quantity > 0 ? 'default' : 'secondary'}
              >
                {`${(ticker[asset].BTC.PRICE).toPrecision(5)} BTC`}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography
                type="body2"
                component="span"
                color={quantity > 0 ? 'default' : 'secondary'}
              >
                <PriceChangeText change={ticker[asset][fiatCurrency].CHANGEPCT24HOUR}/>
              </Typography>
              <Typography
                type="body2"
                component="span"
                color={quantity > 0 ? 'default' : 'secondary'}
              >
                <PriceChangeText change={ticker[asset].BTC.CHANGEPCT24HOUR}/>
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
          >
            <ExpandMore/>
          </IconButton>
        </div>
      </CardContent>
    );
  }

  render() {
    const { asset, coinlist, portfolio } = this.props;
    return (
      <Card>
        {this.rowCard(
          <Avatar
            src={coinlist[asset]
              ? `https://www.cryptocompare.com${coinlist[asset].ImageUrl}`
              : ''}
          />,
        )}
        <Collapse in={this.state.expanded}>
          {portfolio.wallets ? <PortfolioPositionWalletRow asset={asset} balance={portfolio.wallets}/> : ''}
          {Object.keys(portfolio.exchanges).map(key =>
            (<PortfolioPositionExchangeRow
              key={key}
              asset={asset}
              balance={portfolio.exchanges[key]}
              exchange={key.split('-')[0]}
            />))}

        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(PortfolioPosition);

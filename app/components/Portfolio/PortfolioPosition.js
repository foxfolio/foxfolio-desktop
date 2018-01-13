// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Card, CardContent, Grid, IconButton, Typography } from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import { withStyles } from 'material-ui/styles';
import { ExpandMore } from 'material-ui-icons';
import green from 'material-ui/colors/green';
import type { Coinlist } from '../../reducers/coinlist/types.d';
import type { SettingsType } from '../../reducers/settings';
import type { Ticker } from '../../reducers/ticker/types.d';

import { CurrencyAvatar } from '../CurrencyAvatar';
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
  fiatAvatar: {
    color: '#fff',
    backgroundColor: green[500],
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
  coinlist: Coinlist,
  ticker: Ticker,
  portfolio: { total: number, exchanges: { [id: string]: number }, wallets: number },
  classes: any,
  settings: SettingsType
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
    const { asset, portfolio, classes, coinlist, ticker, settings } = this.props;
    const quantity = portfolio.total;

    return (
      <CardContent className={classes.root} onClick={this.handleExpandClick}>
        <div className={classes.avatar}>{avatar}</div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={3}>
              {PositionHeader(coinlist[asset] ? coinlist[asset].FullName : asset, quantity)}
            </Grid>
            <Grid item xs={2} className={classes.right}>
              {ticker[asset] ? PositionQuantity(ticker[asset], quantity, asset, settings) : ''}
            </Grid>
            <Grid item xs={3} className={classes.right}>
              {ticker[asset] ? PositionPrice(ticker[asset], quantity, asset, settings) : ''}
            </Grid>
            <Grid item xs={2} className={classes.right}>
              {ticker[asset] ? PositionPriceChange(ticker[asset], quantity, asset, settings) : ''}
            </Grid>
          </Grid>
        </div>
        <div>
          <IconButton className={classnames(classes.expand, { [classes.expandOpen]: this.state.expanded, })}>
            <ExpandMore/>
          </IconButton>
        </div>
      </CardContent>
    );
  }

  render() {
    const { asset, classes, coinlist, portfolio } = this.props;
    return (
      <Card>
        {this.rowCard(<CurrencyAvatar asset={asset} coinlist={coinlist} fiatClass={classes.fiatAvatar}/>)}
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

const PositionHeader = (name: string, quantity: number) => (
  <div>
    <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
      {name}
    </Typography>
    <Typography
      type="body2"
      component="span"
      color="secondary"
    >
      {quantity.toPrecision(5)}
    </Typography>
  </div>
);

const PositionQuantity = (ticker: Ticker, quantity: number, asset: string, settings: SettingsType) => {
  const { currencyFocus, fiatCurrency } = settings;

  if (currencyFocus === 'equal') {
    return (
      <div>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {`${(parseFloat(asset !== fiatCurrency ? ticker[fiatCurrency].PRICE : 1)
            * quantity).toFixed(2)}  ${fiatCurrency}`}
        </Typography>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {`${(parseFloat(asset !== 'BTC' ? ticker.BTC.PRICE : 1) * quantity).toPrecision(5)} BTC`}
        </Typography>
      </div>
    );
  }
  const fiatEntry =
    `${(parseFloat(asset !== fiatCurrency ? ticker[fiatCurrency].PRICE : 1) * quantity).toFixed(2)}  ${fiatCurrency}`;
  const cryptoEntry = `${(parseFloat(asset !== 'BTC' ? ticker.BTC.PRICE : 1) * quantity).toPrecision(5)} BTC`;

  return (
    <div>
      <Typography type="subheading" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
        {currencyFocus === 'crypto' ? cryptoEntry : fiatEntry}
      </Typography>
      <Typography type="body1" component="span" color="secondary">
        {currencyFocus === 'crypto' ? fiatEntry : cryptoEntry}
      </Typography>
    </div>
  );
};

const PositionPrice = (ticker: Ticker, quantity: number, asset: string, settings: SettingsType) => {
  const { currencyFocus, fiatCurrency } = settings;

  if (currencyFocus === 'equal') {
    return (
      <div>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== fiatCurrency ? `${parseFloat(ticker[fiatCurrency].PRICE).toPrecision(5)} ${fiatCurrency}` : '-'}
        </Typography>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== 'BTC' ? `${parseFloat(ticker.BTC.PRICE).toPrecision(5)} BTC` : '-'}
        </Typography>
      </div>
    );
  }
  const fiatEntry =
    asset !== fiatCurrency ? `${parseFloat(ticker[fiatCurrency].PRICE).toPrecision(5)} ${fiatCurrency}` : '-';
  const cryptoEntry = asset !== 'BTC' ? `${parseFloat(ticker.BTC.PRICE).toPrecision(5)} BTC` : '-';
  return (
    <div>
      <Typography type="subheading" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
        {currencyFocus === 'crypto' ? cryptoEntry : fiatEntry}
      </Typography>
      <Typography type="body1" component="span" color="secondary">
        {currencyFocus === 'crypto' ? fiatEntry : cryptoEntry}
      </Typography>
    </div>
  );
};

const PositionPriceChange = (ticker: Ticker, quantity: number, asset: string, settings: SettingsType) => {
  const { currencyFocus, fiatCurrency } = settings;

  if (currencyFocus === 'equal') {
    return (
      <div>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== fiatCurrency ? <PriceChangeText change={ticker[fiatCurrency].CHANGEPCT24HOUR}/> : '-'}
        </Typography>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== 'BTC' ? <PriceChangeText change={ticker.BTC.CHANGEPCT24HOUR}/> : '-'}
        </Typography>
      </div>
    );
  }
  const fiatEntry = asset !== fiatCurrency ?
    <PriceChangeText change={ticker[fiatCurrency].CHANGEPCT24HOUR} muted={currencyFocus !== 'fiat'}/> : '-';
  const cryptoEntry = asset !== 'BTC' ?
    <PriceChangeText change={ticker.BTC.CHANGEPCT24HOUR} muted={currencyFocus !== 'crypto'}/> : '-';
  return (
    <div>
      <Typography type="subheading" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
        {currencyFocus === 'crypto' ? cryptoEntry : fiatEntry}
      </Typography>
      <Typography type="body1" component="span" color="secondary">
        {currencyFocus === 'crypto' ? fiatEntry : cryptoEntry}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(PortfolioPosition);

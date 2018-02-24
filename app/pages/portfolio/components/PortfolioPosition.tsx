import classnames from 'classnames';
import { Card, CardContent, Grid, IconButton, Typography, WithStyles } from 'material-ui';
import { ExpandMore } from 'material-ui-icons';
import green from 'material-ui/colors/green';
import { StyleRulesCallback, Theme, withStyles } from 'material-ui/styles';
import { CollapseProps } from 'material-ui/transitions';
import MaterialCollapse from 'material-ui/transitions/Collapse';
import React, { Component, ComponentType } from 'react';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { TokenLineChart } from '../../../components/TokenLineChart';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker, TickerEntry } from '../../../reducers/ticker';
import { PortfolioForAsset } from './PortfolioPositions';
import { PriceChangeText } from './PriceChangeText';

// TODO Remove after update to material-ui@1.0.0-beta.33
const Collapse = (MaterialCollapse as any) as ComponentType<CollapseProps & { mountOnEnter: any }>;

export const styles: StyleRulesCallback = (theme: Theme) => ({
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
  collapse: {
    padding: 10,
  },
});

// TODO Use connect to get coinlist, ticker and settings
interface Props {
  asset: string;
  coinlist: Coinlist;
  ticker: Ticker;
  portfolio: PortfolioForAsset;
  settings: SettingsType;
}

interface State {
  expanded: boolean;
}

interface TickerForSymbol {
  [tsym: string]: TickerEntry;
}

export const PortfolioPosition = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    public state = {
      expanded: false,
    };

    public handleExpandClick = () => {
      this.setState({ expanded: !this.state.expanded });
    };

    public rowCard(avatar) {
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
            <IconButton
              className={classnames(classes.expand, { [classes.expandOpen]: this.state.expanded })}
            >
              <ExpandMore />
            </IconButton>
          </div>
        </CardContent>
      );
    }

    public render() {
      const { asset, classes, coinlist, settings } = this.props;
      return (
        <Card>
          {this.rowCard(
            <CurrencyAvatar asset={asset} coinlist={coinlist} fiatClass={classes.fiatAvatar} />
          )}
          <Collapse in={this.state.expanded} timeout="auto" mountOnEnter unmountOnExit>
            <div className={classes.collapse}>
              <TokenLineChart
                fsym={asset}
                tsym={
                  settings.currencyFocus === 'crypto' && asset !== settings.cryptoCurrency
                    ? settings.cryptoCurrency
                    : settings.fiatCurrency
                }
              />
            </div>
          </Collapse>
        </Card>
      );
    }
  }
);

const PositionHeader = (name: string, quantity: number) => (
  <div>
    <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
      {name}
    </Typography>
    <Typography type="body2" component="span" color="secondary">
      {quantity.toPrecision(5)}
    </Typography>
  </div>
);

const PositionQuantity = (
  ticker: TickerForSymbol,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  if (currencyFocus === 'equal') {
    return (
      <div>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {`${((asset !== fiatCurrency ? ticker[fiatCurrency].PRICE : 1) * quantity).toFixed(
            2
          )}  ${fiatCurrency}`}
        </Typography>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {`${(
            (asset !== cryptoCurrency ? ticker[cryptoCurrency].PRICE : 1) * quantity
          ).toPrecision(5)} ${cryptoCurrency}`}
        </Typography>
      </div>
    );
  }
  const fiatEntry = `${(
    (asset !== fiatCurrency ? ticker[fiatCurrency].PRICE : 1) * quantity
  ).toFixed(2)}  ${fiatCurrency}`;
  const cryptoEntry =
    `${((asset !== cryptoCurrency ? ticker[cryptoCurrency].PRICE : 1) * quantity).toPrecision(
      5
    )} ` + `${cryptoCurrency}`;

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

const PositionPrice = (
  ticker: TickerForSymbol,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  if (currencyFocus === 'equal') {
    return (
      <div>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== fiatCurrency
            ? `${ticker[fiatCurrency].PRICE.toPrecision(5)} ${fiatCurrency}`
            : '-'}
        </Typography>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== cryptoCurrency
            ? `${ticker[cryptoCurrency].PRICE.toPrecision(5)} ${cryptoCurrency}`
            : '-'}
        </Typography>
      </div>
    );
  }
  const fiatEntry =
    asset !== fiatCurrency ? `${ticker[fiatCurrency].PRICE.toPrecision(5)} ${fiatCurrency}` : '-';
  const cryptoEntry =
    asset !== cryptoCurrency
      ? `${ticker[cryptoCurrency].PRICE.toPrecision(5)} ${cryptoCurrency}`
      : '-';
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

const PositionPriceChange = (
  ticker: TickerForSymbol,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  if (currencyFocus === 'equal') {
    return (
      <div>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== fiatCurrency ? (
            <PriceChangeText change={ticker[fiatCurrency].CHANGEPCT24HOUR} />
          ) : (
            '-'
          )}
        </Typography>
        <Typography type="body2" component="span" color={quantity > 0 ? 'default' : 'secondary'}>
          {asset !== cryptoCurrency ? (
            <PriceChangeText change={ticker[cryptoCurrency].CHANGEPCT24HOUR} />
          ) : (
            '-'
          )}
        </Typography>
      </div>
    );
  }
  const fiatEntry =
    asset !== fiatCurrency ? (
      <PriceChangeText
        change={ticker[fiatCurrency].CHANGEPCT24HOUR}
        muted={currencyFocus !== 'fiat'}
      />
    ) : (
      '-'
    );
  const cryptoEntry =
    asset !== cryptoCurrency ? (
      <PriceChangeText
        change={ticker[cryptoCurrency].CHANGEPCT24HOUR}
        muted={currencyFocus !== 'crypto'}
      />
    ) : (
      '-'
    );
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

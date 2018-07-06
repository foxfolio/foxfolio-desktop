import { Typography } from '@material-ui/core';
import format from 'format-number';
import React, { CSSProperties } from 'react';
import { TickerEntries } from '../../../../helpers/ticker';
import { CurrencyFocus, SettingsType } from '../../../../reducers/settings';
import { PriceChangeText } from '../PriceChangeText';

export const PositionPrice = (
  ticker: TickerEntries,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  const fiatEntry =
    asset !== fiatCurrency
      ? format(getFormatOptions(fiatCurrency, 2))(ticker[fiatCurrency].PRICE)
      : '';
  const cryptoEntry =
    asset !== cryptoCurrency
      ? format(getFormatOptions(cryptoCurrency, 6))(ticker[cryptoCurrency].PRICE)
      : '';

  return PortfolioPositionColumn(currencyFocus, cryptoEntry, fiatEntry);
};

export const PositionQuantity = (
  ticker: TickerEntries,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  const fiatQuantity = getPrice(asset, fiatCurrency, ticker) * quantity;
  const cryptoQuantity = getPrice(asset, cryptoCurrency, ticker) * quantity;

  const fiatEntry = format(getFormatOptions(fiatCurrency, 2))(fiatQuantity);
  const cryptoEntry = format(getFormatOptions(cryptoCurrency, 6))(cryptoQuantity);

  return PortfolioPositionColumn(currencyFocus, cryptoEntry, fiatEntry);
};

const getFormatOptions = (suffix: string, roundTo: number) => ({
  padRight: roundTo,
  round: roundTo,
  suffix: ` ${suffix}`,
});

const getPrice = (symbol: string, currency: string, ticker: TickerEntries) =>
  symbol !== currency ? ticker[currency].PRICE : 1;

export const PositionPriceChange = (
  ticker: TickerEntries,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  const fiatChange = ticker[fiatCurrency].CHANGEPCT24HOUR;
  const cryptoChange = ticker[cryptoCurrency].CHANGEPCT24HOUR;

  const fiatEntry =
    asset !== fiatCurrency ? (
      <PriceChangeText change={fiatChange} muted={currencyFocus === 'crypto'} />
    ) : (
      ''
    );
  const cryptoEntry =
    asset !== cryptoCurrency ? (
      <PriceChangeText change={cryptoChange} muted={currencyFocus === 'fiat'} />
    ) : (
      ''
    );
  return PortfolioPositionColumn(currencyFocus, cryptoEntry, fiatEntry);
};

const singleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
};

export const PortfolioPositionColumn = (
  currencyFocus: CurrencyFocus,
  cryptoEntry: any,
  fiatEntry: any
) => (
  <div style={currencyFocus !== 'equal' ? singleStyle : {}}>
    <Typography variant="subheading" component="span" color="default" style={{ padding: 'auto' }}>
      {currencyFocus === 'crypto' ? cryptoEntry : fiatEntry}
    </Typography>

    {currencyFocus === 'equal' ? (
      <Typography variant="body1" component="span" color="textSecondary">
        {cryptoEntry}
      </Typography>
    ) : (
      ''
    )}
  </div>
);

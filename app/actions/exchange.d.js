// @flow
export type Exchange =
  | Kraken
  | Binance
  | Bittrex
  | Bitstamp;

type ExchangeBase = {|
  id: string,
  apiKey: string,
  apiSecret: string
|};

export type EmptyExchange = {|
  ...ExchangeBase,
  type: ''
|};

export type Kraken = {|
  ...ExchangeBase,
  type: 'kraken'
|};

export type Binance = {|
  ...ExchangeBase,
  type: 'binance'
|};

export type Bittrex = {|
  ...ExchangeBase,
  type: 'bittrex',
  transactionFile?: string
|};

export type Bitstamp = {|
  ...ExchangeBase,
  type: 'bitstamp',
  customerId: string
|};

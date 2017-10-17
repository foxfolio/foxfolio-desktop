// @flow
import crypto from 'crypto';
import request from 'request-promise-native';
import { failedTransaction, receiveTransactions } from './transactions';
import type { Trade, Transfer } from '../reducers/transactions';
import type { sourceType } from '../reducers/sources';
import type { Dispatch, ThunkAction } from './types';

type BitstampTransaction = {
  id: number,
  datetime: string,
  type: string,
  btc?: number | string,
  eth?: number | string,
  usd?: number | string,
  eur?: number | string,
  xrp?: number | string,
  ltc?: number | string,
  btc_usd?: number | string,
  btc_eur?: number | string,
  eth_usd?: number | string,
  eth_eur?: number | string,
  eth_eur?: number | string,
  xrp_usd?: number | string,
  xrp_eur?: number | string,
  ltc_usd?: number | string,
  ltc_eur?: number | string,
  fee: string
};

const currencies = ['btc', 'eth', 'eur', 'usd', 'ltc', 'xrp'];
const markets = ['btc_usd', 'btc_eur', 'eth_usd', 'eth_eur', 'xrp_usd', 'xrp_eur', 'ltc_usd', 'ltc_eur'];

export default function getBitstampTransactions(source: sourceType): ThunkAction {
  return (dispatch: Dispatch) => {
    getOrderHistory(source)
      .then((results: [Trade[], Transfer[]]) => dispatch(receiveTransactions(source.name, results[0], results[1])))
      .catch(error => dispatch(failedTransaction(source.name, error)));
  };
}

function getOrderHistory(source: sourceType): Promise<[Trade[], Transfer[]]> {
  return bitstampRequest('user_transactions', source)
    .then(orderHistoryToTradesAndTransfers);
}

function bitstampRequest(endpoint, source) {
  const nonce = Date.now().valueOf();
  const hmac = crypto.createHmac('sha256', new Buffer(source.apiSecret, 'utf8'));
  const signature = hmac.update(nonce + source.customerId + source.apiKey).digest('hex').toUpperCase();

  const uri = `https://www.bitstamp.net/api/v2/${endpoint}/`;
  const form = {
    key: source.apiKey,
    signature,
    nonce,
  };
  return request.post(uri, { form }).then(JSON.parse);
}

function orderHistoryToTradesAndTransfers(transactions: BitstampTransaction[]): [Trade[], Transfer[]] {
  const trades = transactions
    .filter(transaction => transaction.type === '2').map(convertBitstampTrade);
  const transfers = transactions
    .filter(transaction => ['0', '1'].includes(transaction.type)).map(convertBitstampTransfer);
  return [trades, transfers];
}

function convertBitstampTransfer(bitstampTransaction: BitstampTransaction): Transfer {
  const transfer: Transfer = {
    id: `${bitstampTransaction.id}`,
    source: 'bitstamp',
    date: new Date(bitstampTransaction.datetime),
    type: bitstampTransaction.type === '0' ? 'DEPOSIT' : 'WITHDRAW',
    currency: '',
    amount: 0,
  };
  currencies.forEach(currency => {
    if (bitstampTransaction[currency] && parseFloat(bitstampTransaction[currency]) !== 0) {
      transfer.currency = currency;
      transfer.amount = parseFloat(bitstampTransaction[currency]);
    }
  });
  return transfer;
}

function convertBitstampTrade(bitstampTransaction: BitstampTransaction): Trade {
  const trade: Trade = {
    id: `${bitstampTransaction.id}`,
    source: 'bitstamp',
    date: new Date(bitstampTransaction.datetime),
    type: 'BUY',
    amount: 0,
    commission: 0,
    rate: 0,
    market: {
      major: '',
      minor: '',
    },
  };
  markets.forEach(market => {
    if (bitstampTransaction[market] && parseFloat(bitstampTransaction[market]) !== 0) {
      trade.market = {
        minor: market.split('_')[0],
        major: market.split('_')[1],
      };
      trade.amount = parseFloat(bitstampTransaction[trade.market.minor]);
      trade.rate = parseFloat(bitstampTransaction[market]);
      trade.commission = parseFloat(bitstampTransaction.fee);
      if (trade.amount < 0 || bitstampTransaction[trade.market.minor] === '-0.00') {
        trade.type = 'SELL';
      } else {
        trade.type = 'BUY';
      }
    }
  });
  if (trade.market.major === '') {
    throw new Error(`Could not convert bitstamp trade with id ${trade.id}`);
  }
  return trade;
}

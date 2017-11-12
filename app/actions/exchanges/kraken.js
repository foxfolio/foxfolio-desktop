// @flow
import crypto from 'crypto';
import querystring from 'querystring';
import { failedTransaction, receiveTransactions } from '../transactions';
import type { Trade, Transfer } from '../../reducers/transactions';
import type { sourceType } from '../../reducers/sources';
import type { Dispatch, ThunkAction } from '../types';

const objToArray = obj => Object.keys(obj).map(key => obj[key]);

const SOURCE_NAME = 'kraken';
const API_VERSION = 0;
const API_BASE_URL = 'https://api.kraken.com';

type KrakenTradeType = {
  ordertxid: string,
  pair: string,
  time: number,
  type: 'buy' | 'sell',
  ordertype: string,
  price: string,
  cost: string,
  fee: string,
  vol: string
};

type KrakenLedgerType = {
  refid: string,
  time: number,
  type: string,
  aclass: string,
  asset: string,
  amount: string,
  fee: string,
  balance: string
};

export function getKrakenTransactions(source: sourceType): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const trades = await getTradesHistory(source);
      const transfers = await getTransferHistory(source);
      return dispatch(receiveTransactions(SOURCE_NAME, trades, transfers));
    } catch (error) {
      return dispatch(failedTransaction(source.name, error.message));
    }
  };
}

function getTradesHistory(source: sourceType): Promise<Trade[]> {
  return krakenRequest('TradesHistory', source)
    .then(result => result.trades)
    .then(objToArray)
    .then(tradesHistoryToTransactions);
}

function getTransferHistory(source: sourceType): Promise<Transfer[]> {
  return krakenRequest('Ledgers', source)
    .then(result => result.ledger)
    .then(obj => Object.keys(obj).map(key => obj[key]))
    .then(ledgerEntriesToTransfers);
}

function krakenRequest(endpoint: string, source: sourceType) {
  const path = `/${API_VERSION}/private/${endpoint}`;

  const hash = crypto.createHash('sha256');
  const hmac = crypto.createHmac('sha512', new Buffer(source.apiSecret, 'base64'));

  const nonce = Date.now().valueOf();
  const body = querystring.stringify({ nonce });

  const hashDigest = hash.update(nonce + body).digest('binary');
  const signatureDigest = hmac.update(path + hashDigest, 'binary').digest('base64');

  return fetch(API_BASE_URL + path, {
    method: 'POST',
    body,
    headers: {
      'API-Key': source.apiKey,
      'API-Sign': signatureDigest,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(result => result.json())
    .then(json => json.result);
}

function tradesHistoryToTransactions(krakenTrades: KrakenTradeType[]): Trade[] {
  return krakenTrades.map(convertKrakenTrade);
}

function ledgerEntriesToTransfers(ledgerEntries: KrakenLedgerType[]): Transfer[] {
  return ledgerEntries.filter(entry => ['deposit', 'withdraw'].includes(entry.type)).map(convertKrakenTransfer);
}

function convertKrakenTrade(krakenTrade: KrakenTradeType): Trade {
  return {
    id: krakenTrade.ordertxid,
    date: new Date(krakenTrade.time * 1000),
    source: SOURCE_NAME,
    type: krakenTrade.type === 'buy' ? 'BUY' : 'SELL',
    market: {
      minor: unifySymbols(krakenTrade.pair.slice(1, 4)),
      major: unifySymbols(krakenTrade.pair.slice(5, 8)),
    },
    amount: parseFloat(krakenTrade.vol),
    commission: parseFloat(krakenTrade.fee),
    rate: parseFloat(krakenTrade.price)
  };
}

function convertKrakenTransfer(ledgerEntry: KrakenLedgerType): Transfer {
  return {
    id: ledgerEntry.refid,
    date: new Date(ledgerEntry.time * 1000),
    source: SOURCE_NAME,
    type: ledgerEntry.type === 'deposit' ? 'DEPOSIT' : 'WITHDRAW',
    currency: unifySymbols(ledgerEntry.asset.slice(1, 4)),
    amount: Math.abs(parseFloat(ledgerEntry.amount)),
  };
}

function unifySymbols(symbol: string) {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    default:
      return symbol;
  }
}

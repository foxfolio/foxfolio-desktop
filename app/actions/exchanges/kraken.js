// @flow
import crypto from 'crypto';
import querystring from 'querystring';
import { failedTransaction, receiveTransactions } from '../transactions';
import type { Trade, Transfer } from '../transaction.d';
import type { Kraken } from '../exchange.d';
import type { Dispatch, ThunkAction } from '../action.d';

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

export function getKrakenTransactions(exchange: Kraken): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const trades = await getTradesHistory(exchange);
      const transfers = await getTransferHistory(exchange);
      return dispatch(receiveTransactions(exchange, trades, transfers)); // TODO Split into two separate actions
    } catch (error) {
      return dispatch(failedTransaction(exchange, error.message));
    }
  };
}

function getTradesHistory(exchange: Kraken): Promise<Trade[]> {
  return krakenRequest('TradesHistory', exchange)
    .then(result => result.trades)
    .then(objToArray)
    .then(tradesHistoryToTransactions);
}

function getTransferHistory(exchange: Kraken): Promise<Transfer[]> {
  return krakenRequest('Ledgers', exchange)
    .then(result => result.ledger)
    .then(obj => Object.keys(obj).map(key => obj[key]))
    .then(ledgerEntriesToTransfers);
}

function krakenRequest(endpoint: string, exchange: Kraken) {
  const path = `/${API_VERSION}/private/${endpoint}`;

  const hash = crypto.createHash('sha256');
  const hmac = crypto.createHmac('sha512', Buffer.from(exchange.apiSecret, 'base64'));

  const nonce = Date.now().valueOf();
  const body = querystring.stringify({ nonce });

  const hashDigest = hash.update(nonce + body).digest('binary');
  const signatureDigest = hmac.update(path + hashDigest, 'binary').digest('base64');

  return fetch(API_BASE_URL + path, {
    method: 'POST',
    body,
    headers: {
      'API-Key': exchange.apiKey,
      'API-Sign': signatureDigest,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(result => result.json())
    .then(json => json.result);
}

function tradesHistoryToTransactions(krakenTrades: KrakenTradeType[]): Trade[] {
  return krakenTrades.map(convertKrakenTrade);
}

function ledgerEntriesToTransfers(ledgerEntries: KrakenLedgerType[]): Transfer[] {
  return ledgerEntries.filter(entry => ['deposit', 'withdrawal'].includes(entry.type)).map(convertKrakenTransfer);
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
    rate: parseFloat(krakenTrade.price),
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

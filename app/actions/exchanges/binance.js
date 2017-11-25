// @flow
import crypto from 'crypto';
import querystring from 'querystring';
import { failedTransaction, receiveTransfers } from '../transactions';
import type { Transfer } from '../transaction.d';
import type { Binance } from '../exchange.d';
import type { Dispatch, ThunkAction } from '../action.d';
import { unifySymbols } from '../../helpers/transactions';

const SOURCE_NAME = 'binance';

const API_BASE_URL = ' https://api.binance.com';

// type BinanceTrade = {
//   +id: number,
//   +price: string,
//   +qty: string,
//   +commission: string,
//   +commissionAsset: string,
//   +time: number,
//   +isBuyer: boolean,
//   +isMaker: boolean,
//   +isBestMatch: boolean
// };

type BinanceDeposit = {
  +txId: string,
  +insertTime: number,
  +asset: string,
  +amount: number,
  +address: string,
  +addressTag: string,
  +status: number
};

type BinanceWithdrawal = {
  +id: string,
  +applyTime: number,
  +asset: string,
  +amount: number,
  +address: string,
  +addressTag: string,
  +txId: string,
  +status: number
};

export function getBinanceTransactions(exchange: Binance): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const transfers = await getTransferHistory(exchange);
      // const assets = R.pipe(R.map(transfer => transfer.currency), R.uniq)(transfers);
      // const trades = await getTradesHistory(exchange, assets);
      return dispatch(receiveTransfers(exchange, transfers));
    } catch (error) {
      return dispatch(failedTransaction(exchange, error.message));
    }
  };
}

// function getTradesHistory(exchange: Binance, assets: string[]): Promise<Trade[]> {
//   return Promise.all(
//     assets.map(symbol =>
//       binanceRequest('/api/v3/myTrades', exchange, { symbol }).then(trades => ({ symbol, trades }))))
//     .then(tradeHistoryToTransactions);
// }

async function getTransferHistory(exchange: Binance): Promise<Array<Transfer>> {
  const deposits = await getDepositHistory(exchange);
  const withdrawals = await getWithdrawalHistory(exchange);
  return deposits.concat(withdrawals);
}

function getDepositHistory(exchange: Binance): Promise<Array<Transfer>> {
  return binanceRequest('/wapi/v3/depositHistory.html', exchange)
    .then(result => result.depositList)
    .then(depositHistoryToTransactions);
}

function getWithdrawalHistory(exchange: Binance): Promise<Array<Transfer>> {
  return binanceRequest('/wapi/v3/withdrawHistory.html', exchange)
    .then(result => result.withdrawList)
    .then(withdrawalHistoryToTransactions);
}

async function binanceRequest(path: string, exchange: Binance, query: Object = {}) {
  const timestamp = Date.now().valueOf();
  const recvWindow = 5000;
  const queryString = querystring.stringify({ ...query, timestamp, recvWindow });
  const hmac = crypto.createHmac('sha256', exchange.apiSecret);
  const signature = hmac.update(queryString).digest('hex');

  const headers = new Headers({
    'X-MBX-APIKEY': exchange.apiKey,
  });

  const response = await fetch(`${API_BASE_URL}${path}?${queryString}&signature=${signature}`, { headers });

  if (!response.ok || response.status >= 400) {
    throw new Error(`Error ${response.status}`);
  }
  const json = await response.json();

  if (json.success === false) {
    throw new Error(JSON.parse(json.msg).msg);
  }

  return json;
}

// function tradeHistoryToTransactions(trades: Array<{ symbol: string, trades: BinanceTrade[] }>): Array<Trade> {
//   return R.flatten(trades.map(bla => bla.trades.map(trade => convertOrder(trade, bla.symbol))));
// }

function depositHistoryToTransactions(deposits: BinanceDeposit[]): Array<Transfer> {
  return deposits.map(convertDeposit);
}

function withdrawalHistoryToTransactions(withdrawals: BinanceWithdrawal[]): Array<Transfer> {
  return withdrawals.map(convertWithdrawal);
}

// function convertOrder(order: BinanceTrade, symbol: string): Trade {
//   return ({
//     id: `${order.id}`,
//     date: new Date(order.time / 1000),
//     source: SOURCE_NAME,
//     type: order.isBuyer ? 'BUY' : 'SELL',
//     market: {
//       major: unifySymbols(order.co),
//       minor: unifySymbols(symbol),
//     },
//     amount: parseFloat(order.Quantity) - parseFloat(order.QuantityRemaining),
//     commission: parseFloat(order.Commission),
//     rate: parseFloat(order.PricePerUnit),
//   });
// }

function convertDeposit(deposit: BinanceDeposit): Transfer {
  return {
    id: `${deposit.txId}`,
    date: new Date(deposit.insertTime),
    source: SOURCE_NAME,
    type: 'DEPOSIT',
    currency: unifySymbols(deposit.asset),
    amount: parseFloat(deposit.amount),
  };
}

function convertWithdrawal(withdrawal: BinanceWithdrawal): Transfer {
  return {
    id: `${withdrawal.id}`,
    date: new Date(withdrawal.applyTime),
    source: SOURCE_NAME,
    type: 'WITHDRAW',
    currency: unifySymbols(withdrawal.asset),
    amount: parseFloat(withdrawal.amount),
  };
}

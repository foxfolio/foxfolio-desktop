// @flow
import crypto from 'crypto';
import querystring from 'querystring';
import { failedBalances, failedTransaction, receiveBalances, receiveTransactions } from '../transactions';
import type { Transfer } from '../transaction.d';
import type { Binance } from '../exchange.d';
import type { Dispatch, ThunkAction } from '../action.d';
import { unifySymbols } from '../../helpers/transactions';
import type { Balances } from '../../types/portfolio.d.ts';

const SOURCE_NAME = 'binance';

const API_BASE_URL = ' https://api.binance.com';

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

export function getBinanceBalances(exchange: Binance): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const balances = await getBalances(exchange);
      dispatch(receiveBalances(exchange, balances));
    } catch (error) {
      return dispatch(failedBalances(exchange, error.message));
    }
  };
}

export function getBinanceTransactions(exchange: Binance): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const transfers = await getTransferHistory(exchange);
      dispatch(receiveTransactions(exchange, [], transfers));
    } catch (error) {
      return dispatch(failedTransaction(exchange, error.message));
    }
  };
}

async function getTransferHistory(exchange: Binance): Promise<Array<Transfer>> {
  const deposits = await getDepositHistory(exchange);
  const withdrawals = await getWithdrawalHistory(exchange);
  return deposits.concat(withdrawals);
}

function getBalances(exchange: Binance): Promise<Balances> {
  return binanceRequest('/api/v3/account', exchange)
    .then(result => result.balances)
    .then(balances => balances
      .filter(balance => parseFloat(balance.free) > 0)
      .reduce(
        (acc, balance) => ({
          ...acc,
          [balance.asset]: parseFloat(balance.free),
        }), {}));
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
  const recvWindow = 60000;
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

function depositHistoryToTransactions(deposits: BinanceDeposit[]): Array<Transfer> {
  return deposits.map(convertDeposit);
}

function withdrawalHistoryToTransactions(withdrawals: BinanceWithdrawal[]): Array<Transfer> {
  return withdrawals.map(convertWithdrawal);
}

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

// @flow
import crypto from 'crypto';
import { Converter } from 'csvtojson';
import type { Balances } from '../../types/portfolio.d.ts';
import { failedTransaction, receiveBalances, receiveTransactions } from '../transactions';
import type { Trade, Transfer } from '../transaction.d';
import type { Bittrex } from '../exchange.d';
import type { Dispatch, ThunkAction } from '../action.d';

type BittrexTrade = {
  +OrderUuid: string,
  +OrderType: string,
  +TimeStamp: string,
  +Exchange: string,
  +PricePerUnit: number | string,
  +Quantity: number | string,
  +QuantityRemaining: number | string,
  +Commission: number | string
};

type BittrexDeposit = {
  +Id: number,
  +LastUpdated: string,
  +Currency: string,
  +Amount: number | string
};

type BittrexWithdrawal = {
  +PaymentUuid: number,
  +Opened: string,
  +Currency: string,
  +Amount: number | string
};

export function getBittrexTransactions(exchange: Bittrex): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const trades = await getOrderHistory(exchange);
      const transfers = await getTransferHistory(exchange);
      dispatch(receiveTransactions(exchange, trades, transfers));

      const balances = await getBalances(exchange);
      dispatch(receiveBalances(exchange, balances));
    } catch (error) {
      dispatch(failedTransaction(exchange, error.message));
    }
  };
}

export function readBittrexTransactionsFromFile(exchange: Bittrex): ThunkAction {
  return (dispatch: Dispatch) => {
    if (exchange.transactionFile) {
      const trades: BittrexTrade[] = [];
      new Converter()
        .fromFile(exchange.transactionFile, { encoding: 'utf8' })
        .preRawData((csvRawData, cb) => {
          cb(csvRawData.replace(/\0/g, ''));
        })
        .on('json', (trade) => {
          trades.push({
            ...trade,
            OrderType: trade.Type,
            TimeStamp: trade.Closed,
            Commission: trade.CommissionPaid,
            PricePerUnit: trade.Price / trade.Quantity,
            QuantityRemaining: 0,
          });
        })
        .on('done', () => {
          dispatch(receiveTransactions(exchange, orderHistoryToTransactions(trades), []));
        });
    }
  };
}

function getOrderHistory(exchange: Bittrex): Promise<Array<Trade>> {
  return bittrexRequest('getorderhistory', exchange)
    .then(orderHistoryToTransactions);
}

function getTransferHistory(exchange: Bittrex): Promise<Array<Transfer>> {
  return Promise.all([getDepositHistory(exchange), getWithdrawalHistory(exchange)])
    .then((results: [Transfer[], Transfer[]]) => results[0].concat(results[1]));
}

function getDepositHistory(exchange: Bittrex): Promise<Array<Transfer>> {
  return bittrexRequest('getdeposithistory', exchange)
    .then(depositHistoryToTransactions);
}

function getWithdrawalHistory(exchange: Bittrex): Promise<Array<Transfer>> {
  return bittrexRequest('getwithdrawalhistory', exchange)
    .then(withdrawalHistoryToTransactions);
}

function getBalances(exchange: Bittrex): Promise<Balances> {
  return bittrexRequest('getbalances', exchange)
    .then(balances =>
      balances.filter(balance => parseFloat(balance.Balance) > 0)
        .reduce(
          (acc, balance) => ({
            ...acc,
            [balance.Currency]: parseFloat(balance.Balance),
          }), {}));
}

function bittrexRequest(endpoint: string, exchange: Bittrex) {
  const nonce = Date.now().valueOf();
  const uri = `https://bittrex.com/api/v1.1/account/${endpoint}?apikey=${exchange.apiKey}&nonce=${nonce}`;
  const hmac = crypto.createHmac('sha512', exchange.apiSecret);
  const apisign = hmac.update(uri).digest('hex');

  const headers = new Headers({ apisign });

  return fetch(uri, { headers })
    .then(result => result.json())
    .then(json => json.result);
}

function orderHistoryToTransactions(bittrexTrades: BittrexTrade[]): Array<Trade> {
  return bittrexTrades.map(convertBittrexTrade);
}

function depositHistoryToTransactions(bittrexDeposits: BittrexDeposit[]): Array<Transfer> {
  return bittrexDeposits.map(convertBittrexDeposit);
}

function withdrawalHistoryToTransactions(bittrexWithdrawals: BittrexWithdrawal[]): Array<Transfer> {
  return bittrexWithdrawals.map(convertBittrexWithdrawal);
}

function convertBittrexTrade(bittrexTransaction): Trade {
  const type = bittrexTransaction.OrderType.split('_')[1];
  if (!['BUY', 'SELL'].includes(type)) {
    throw new Error('Invalid trade type');
  }

  return ({
    id: bittrexTransaction.OrderUuid,
    date: new Date(bittrexTransaction.TimeStamp),
    source: 'bittrex',
    type: type === 'BUY' ? 'BUY' : 'SELL',
    market: {
      major: unifySymbols(bittrexTransaction.Exchange.split('-')[0]),
      minor: unifySymbols(bittrexTransaction.Exchange.split('-')[1]),
    },
    amount: parseFloat(bittrexTransaction.Quantity) - parseFloat(bittrexTransaction.QuantityRemaining),
    commission: parseFloat(bittrexTransaction.Commission),
    rate: parseFloat(bittrexTransaction.PricePerUnit),
  });
}

function convertBittrexDeposit(deposit: BittrexDeposit): Transfer {
  return {
    id: `${deposit.Id}`,
    date: new Date(deposit.LastUpdated),
    source: 'bittrex',
    type: 'DEPOSIT',
    currency: unifySymbols(deposit.Currency),
    amount: parseFloat(deposit.Amount),
  };
}

function convertBittrexWithdrawal(deposit: BittrexWithdrawal): Transfer {
  return {
    id: `${deposit.PaymentUuid}`,
    date: new Date(deposit.Opened),
    source: 'bittrex',
    type: 'WITHDRAW',
    currency: unifySymbols(deposit.Currency),
    amount: parseFloat(deposit.Amount),
  };
}

function unifySymbols(symbol: string) {
  switch (symbol) {
    case 'BCC':
      return 'BCH';
    default:
      return symbol;
  }
}

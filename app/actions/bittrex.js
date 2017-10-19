// @flow
import crypto from 'crypto';
import { Converter } from 'csvtojson';
import { failedTransaction, receiveTransactions } from './transactions';
import type { Trade, Transfer } from '../reducers/transactions';
import type { sourceType } from '../reducers/sources';
import type { Dispatch, ThunkAction } from './types';

type bittrexTradeType = {
  +OrderUuid: string,
  +OrderType: string,
  +TimeStamp: string,
  +Exchange: string,
  +PricePerUnit: number | string,
  +Quantity: number | string,
  +QuantityRemaining: number | string,
  +Commission: number | string
};

type bittrexDepositType = {
  +Id: number,
  +LastUpdated: string,
  +Currency: string,
  +Amount: number | string
};

export function getBittrexTransactions(source: sourceType): ThunkAction {
  return (dispatch: Dispatch) => {
    Promise.all([getOrderHistory(source), getDepositHistory(source)])
      .then((results: [Trade[], Transfer[]]) => dispatch(receiveTransactions('bittrex', results[0], results[1])))
      .catch(error => dispatch(failedTransaction(source.name, error)));
  };
}

export function readBittrexTransactionsFromFile(source: sourceType): ThunkAction {
  return (dispatch: Dispatch) => {
    if (source.transactionFile) {
      const trades: bittrexTradeType[] = [];
      new Converter()
        .fromFile(source.transactionFile, { encoding: 'utf8' })
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
          dispatch(receiveTransactions('bittrex', orderHistoryToTransactions(trades), []));
        });
    }
  };
}

function getOrderHistory(source): Promise<Array<Trade>> {
  return bittrexRequest('getorderhistory', source)
    .then(orderHistoryToTransactions);
}

function getDepositHistory(source): Promise<Array<Transfer>> {
  return bittrexRequest('getdeposithistory', source)
    .then(depositHistoryToTransactions);
}

function bittrexRequest(endpoint, source) {
  const nonce = Date.now().valueOf();
  const uri = `https://bittrex.com/api/v1.1/account/${endpoint}?apikey=${source.apiKey}&nonce=${nonce}`;
  const hmac = crypto.createHmac('sha512', source.apiSecret);
  const apisign = hmac.update(uri).digest('hex');

  const headers = new Headers({ apisign });

  return fetch(uri, { headers })
    .then(result => result.json())
    .then(json => json.result);
}

function orderHistoryToTransactions(bittrexTrades: bittrexTradeType[]): Array<Trade> {
  return bittrexTrades.map(convertBittrexTrade);
}

function depositHistoryToTransactions(bittrexDeposits: bittrexDepositType[]): Array<Transfer> {
  return bittrexDeposits.map(convertBittrexDeposit);
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
      major: bittrexTransaction.Exchange.split('-')[0],
      minor: bittrexTransaction.Exchange.split('-')[1],
    },
    amount: parseFloat(bittrexTransaction.Quantity) - parseFloat(bittrexTransaction.QuantityRemaining),
    commission: parseFloat(bittrexTransaction.Commission),
    rate: parseFloat(bittrexTransaction.PricePerUnit),
  });
}

function convertBittrexDeposit(deposit: bittrexDepositType): Transfer {
  return {
    id: `${deposit.Id}`,
    date: new Date(deposit.LastUpdated),
    source: 'bittrex',
    type: 'DEPOSIT',
    currency: deposit.Currency,
    amount: parseFloat(deposit.Amount),
  };
}

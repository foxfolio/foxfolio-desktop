// @flow
import crypto from 'crypto';
import { receiveTransactions } from './transactions';
import type { Trade, Transfer } from '../reducers/transactions';
import type { sourceType } from '../reducers/sources';

type actionType = {
  +type: string
};

type bittrexTradeType = {
  +OrderUuid: string,
  +OrderType: string,
  +TimeStamp: string,
  +Exchange: string,
  +PricePerUnit: number,
  +Quantity: number,
  +QuantityRemaining: number,
  +Commission: number
};

type bittrexDepositType = {
  +Id: number,
  +LastUpdated: string,
  +Currency: string,
  +Amount: number
};

export default function getBittrexTransactions(source: sourceType) {
  return (dispatch: (action: actionType) => void) =>
    Promise.all([getOrderHistory(source), getDepositHistory(source)])
      .then((results: [Trade[], Transfer[]]) => dispatch(receiveTransactions('bittrex', results[0], results[1])));
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
    amount: bittrexTransaction.Quantity - bittrexTransaction.QuantityRemaining,
    commission: bittrexTransaction.Commission,
    rate: bittrexTransaction.PricePerUnit,
  });
}

function convertBittrexDeposit(deposit: bittrexDepositType): Transfer {
  return {
    id: `${deposit.Id}`,
    date: new Date(deposit.LastUpdated),
    source: 'bittrex',
    type: 'DEPOSIT',
    currency: deposit.Currency,
    amount: deposit.Amount,
  };
}

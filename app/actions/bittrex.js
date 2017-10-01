// @flow
import crypto from 'crypto';
import { receiveTransactions } from './transactions';
import type { transactionType } from '../reducers/transactions';
import type { sourceType } from '../reducers/sources';

type actionType = {
  +type: string
};

export default function getBittrexTransactions(source: sourceType) {
  return (dispatch: (action: actionType) => void) =>
    Promise.all([getOrderHistory(source), getDepositHistory(source)])
      .then(results => [].concat(...results))
      .then(transactions => dispatch(receiveTransactions('bittrex', transactions)));
}

function getOrderHistory(source) {
  return bittrexRequest('getorderhistory', source)
    .then(orderHistoryToTransactions);
}

function getDepositHistory(source) {
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
    .then(result => result.json());
}

function orderHistoryToTransactions(response): Array<transactionType> {
  return response.result.map(bittrexTransaction => {
    console.log(bittrexTransaction);
    const type = bittrexTransaction.OrderType.split('_')[1];
    return ({
      id: bittrexTransaction.OrderUuid,
      date: new Date(bittrexTransaction.TimeStamp),
      source: 'bittrex',
      type: 'trade',
      outgoing: bittrexTransaction.Exchange.split('-')[type === 'BUY' ? 0 : 1],
      incoming: bittrexTransaction.Exchange.split('-')[type === 'BUY' ? 1 : 0],
      rate: bittrexTransaction.PricePerUnit,
      quantityIncoming: type === 'BUY'
        ? bittrexTransaction.Quantity - bittrexTransaction.QuantityRemaining
        : bittrexTransaction.Price - bittrexTransaction.Commission,
      quantityOutgoing: type === 'BUY'
        ? bittrexTransaction.Price + bittrexTransaction.Commission
        : bittrexTransaction.Quantity - bittrexTransaction.QuantityRemaining,
    });
  });
}

function depositHistoryToTransactions(depositHistory): Array<transactionType> {
  return depositHistory.result.map(deposit => ({
    id: deposit.Id,
    date: new Date(deposit.LastUpdated),
    source: 'bittrex',
    type: 'deposit',
    incoming: deposit.Currency,
    quantityIncoming: deposit.Amount,
  }));
}

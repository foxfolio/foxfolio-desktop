import crypto from 'crypto';
import { receiveTransactions } from './transactions';

type actionType = {
  +type: string
};

export default function getBittrexTransactions(source) {
  return (dispatch: (action: actionType) => void) => {
    return Promise.all([getOrderHistory(source), getDepositHistory(source)])
      .then(results => [].concat(...results))
      .then(transactions => dispatch(receiveTransactions('bittrex', transactions)));
  };
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

function orderHistoryToTransactions(response) {
  return response.result.map(bittrexTransaction => ({
    id: bittrexTransaction.OrderUuid,
    date: new Date(bittrexTransaction.TimeStamp),
    type: bittrexTransaction.OrderType.split('_')[1].toLowerCase(),
    fromCurr: bittrexTransaction.Exchange.split('-')[0],
    toCurr: bittrexTransaction.Exchange.split('-')[1],
    price: bittrexTransaction.Price,
    rate: bittrexTransaction.PricePerUnit,
    quantity: bittrexTransaction.Quantity,
  }));
}

function depositHistoryToTransactions(depositHistory) {
  return depositHistory.result.map(deposit => ({
    id: deposit.Id,
    date: new Date(deposit.LastUpdated),
    type: 'deposit',
    toCurr: deposit.Currency,
    rate: 1,
    price: 1,
    quantity: deposit.Amount,
  }));
}

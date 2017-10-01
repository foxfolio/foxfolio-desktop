import crypto from 'crypto';
import request from 'request-promise-native';
import R from 'ramda';
import { receiveTransactions } from './transactions';

type actionType = {
  +type: string
};

export default function getBitstampTransactions(source) {
  return (dispatch: (action: actionType) => void) =>
    getOrderHistory(source)
      .then(results => [].concat(...results))
      .then(transactions => dispatch(receiveTransactions('bitstamp', transactions)));
}

function getOrderHistory(source) {
  return bitstampRequest('user_transactions', source)
    .then(orderHistoryToTransactions);
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

function orderHistoryToTransactions(response) {
  return response.map(bitstampTransaction => {
    const transaction = {
      id: bitstampTransaction.id,
      source: 'bitstamp',
      date: new Date(bitstampTransaction.datetime),
      type: getTypeFromId(bitstampTransaction.type),
    };
    return R.pipe(updateTransactionWithCurrency(bitstampTransaction, 'btc'),
      updateTransactionWithCurrency(bitstampTransaction, 'eth'),
      updateTransactionWithCurrency(bitstampTransaction, 'eur'),
      updateTransactionWithCurrency(bitstampTransaction, 'usd'),
      updateTransactionWithCurrency(bitstampTransaction, 'xrp'))(transaction);
  });
}

function getTypeFromId(typeId) {
  switch (typeId) {
    case '0':
      return 'deposit';
    case '1':
      return 'withdraw';
    case '2':
      return 'trade';
    default:
      return 'UNKNOWN';
  }
}

function updateTransactionWithCurrency(bitstampTransaction, currency) {
  return transaction => {
    if (bitstampTransaction[currency]) {
      console.log(currency);
      console.log(bitstampTransaction);
      const value = parseFloat(bitstampTransaction[currency]);
      if (value < 0 || bitstampTransaction[currency] === '-0.00') {
        transaction.outgoing = currency.toUpperCase();
        transaction.quantityOutgoing = -1 * value;
        if (transaction.quantityIncoming) {
          transaction.rate = Math.abs(transaction.quantityOutgoing / transaction.quantityIncoming);
        }
      } else {
        transaction.incoming = currency.toUpperCase();
        transaction.quantityIncoming = value;
        if (transaction.quantityOutgoing) {
          transaction.rate = Math.abs(transaction.quantityOutgoing / transaction.quantityIncoming);
        }
      }
    }
    return transaction;
  };
}

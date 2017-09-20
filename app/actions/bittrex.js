import crypto from 'crypto';
import { receiveTransactions } from './transactions';

type actionType = {
  +type: string
};

export default function getBittrexTransactions(source) {
  return (dispatch: (action: actionType) => void) => {
    const nonce = Date.now().valueOf();
    const uri = `https://bittrex.com/api/v1.1/account/getorderhistory?apikey=${source.apiKey}&nonce=${nonce}`;
    const hmac = crypto.createHmac('sha512', source.apiSecret);
    const apisign = hmac.update(uri).digest('hex');

    const headers = new Headers({ apisign });

    return fetch(uri, { headers })
      .then(result => result.json())
      .then(toTransactions)
      .then(transactions => dispatch(receiveTransactions('bittrex', transactions)));
  };
}

function toTransactions(response) {
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

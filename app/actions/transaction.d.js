// @flow
export type Transaction = Trade | Transfer;

export type Trade = {|
  id: string,
  source: string,
  date: Date,
  market: {
    major: string,
    minor: string
  },
  type: 'BUY' | 'SELL',
  amount: number,
  rate: number,
  commission: number
|};

export type Transfer = {|
  id: string,
  source: string,
  date: Date,
  currency: string,
  type: 'DEPOSIT' | 'WITHDRAW',
  amount: number
|};

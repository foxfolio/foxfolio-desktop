export interface PriceActions {
  type: 'RECEIVE_PRICE_FOR_TIME';
  fsym: string;
  tsym: string;
  timestamp: number;
  price: number;
}

export interface Prices {
  [fsym: string]:
    | {
        [tsym: string]:
          | {
              [timestamp: number]: number | undefined;
            }
          | undefined;
      }
    | undefined;
}

export interface CoinlistActions {
  type: 'RECEIVE_COIN_LIST';
  coinlist: Coinlist;
}

export interface Coinlist {
  [symbol: string]: CoinlistEntry;
}

export interface CoinlistEntry {
  FullName: string;
  ImageUrl: string;
  SortOrder: string;
}

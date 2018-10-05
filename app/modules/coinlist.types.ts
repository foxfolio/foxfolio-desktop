export interface Coinlist {
  [symbol: string]: CoinlistEntry;
}

export interface CoinlistEntry {
  FullName: string;
  ImageUrl: string;
  SortOrder: string;
}

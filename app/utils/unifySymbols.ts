export function unifySymbols(symbol: string): string {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    case 'XRB':
      return 'NANO';
    case 'ACT':
      return 'ACT*';
    case 'IOTA':
      return 'IOT';
    default:
      return symbol;
  }
}

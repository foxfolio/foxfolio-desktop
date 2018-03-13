export function unifySymbols(symbol: string): string {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    case 'NANO':
      return 'XRB';
    case 'ACT':
      return 'ACT*';
    default:
      return symbol;
  }
}

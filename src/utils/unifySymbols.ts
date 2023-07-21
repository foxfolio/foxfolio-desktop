export function unifySymbols(symbol: string): string {
  switch (symbol) {
    case 'XBT':
      return 'BTC';
    case 'XRB':
      return 'NANO';
    case 'ACT':
      return 'ACT*';
    case 'IOT':
      return 'MIOTA';
    case 'IOTA':
      return 'MIOTA';
    default:
      return symbol;
  }
}

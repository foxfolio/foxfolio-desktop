import { CryptoCurrency, FiatCurrency } from '../utils/currencies';

export type CurrencyFocus = 'crypto' | 'fiat' | 'equal';

export interface SettingsType {
  fiatCurrency: FiatCurrency;
  cryptoCurrency: CryptoCurrency;
  includeFiat: boolean;
  hideZeroBalances: boolean;
  currencyFocus: CurrencyFocus;
  theme: 'light' | 'dark';
}

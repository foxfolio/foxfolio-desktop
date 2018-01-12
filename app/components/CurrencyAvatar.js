// @flow
import React from 'react';
import { Avatar } from 'material-ui';
import { AccountBalance, HelpOutline } from 'material-ui-icons';
import type { Coinlist } from '../reducers/coinlist/types.d';
import { getFiatCurrencies } from '../utils/fiatCurrencies';

type Props = {
  asset: string,
  coinlist: Coinlist,
  fiatClass: Object
};

export const CurrencyAvatar = ({ asset, coinlist, fiatClass }: Props) => {
  let avatar = <Avatar><HelpOutline/></Avatar>;
  if (coinlist[asset]) {
    avatar = <Avatar src={`https://www.cryptocompare.com${coinlist[asset].ImageUrl}`}/>;
  } else if (getFiatCurrencies().includes(asset)) {
    avatar = <Avatar className={fiatClass}><AccountBalance/></Avatar>;
  }
  return avatar;
};

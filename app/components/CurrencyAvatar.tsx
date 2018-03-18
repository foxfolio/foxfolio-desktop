import { Avatar } from 'material-ui';
import { AccountBalance, HelpOutline } from 'material-ui-icons';
import React from 'react';

import { Coinlist } from '../reducers/coinlist';
import { getFiatCurrencies } from '../utils/currencies';

interface Props {
  asset: string;
  coinlist: Coinlist;
  fiatClass: string;
}

export const CurrencyAvatar = ({ asset, coinlist, fiatClass }: Props) => {
  let avatar = (
    <Avatar>
      <HelpOutline />
    </Avatar>
  );
  if (coinlist[asset]) {
    avatar = <Avatar src={`https://www.cryptocompare.com${coinlist[asset].ImageUrl}`} />;
  } else if (getFiatCurrencies().includes(asset)) {
    avatar = (
      <Avatar className={fiatClass}>
        <AccountBalance />
      </Avatar>
    );
  }
  return avatar;
};

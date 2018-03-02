import R from 'ramda';
import { createSelector } from 'reselect';
import { GlobalState } from '../../../reducers';
import { Trade } from '../../../reducers/exchanges.types';
import { TradesMap } from '../../../reducers/trades';
import { getExchanges } from '../../../selectors/selectGlobalState';

export const getManualTrades = (state: GlobalState): TradesMap => state.trades;

export const getAllTrades = createSelector(
  [getExchanges, getManualTrades],
  (exchanges, manualTrades): Trade[] => {
    const exchangeTrades: Trade[] = R.values(exchanges)
      .map(exchange => exchange.trades)
      .reduce((acc: Trade[], trades) => acc.concat(trades), []);

    return exchangeTrades.concat(R.values(manualTrades));
  }
);

import _ from 'lodash';
import { createSelector } from 'reselect';
import { GlobalState } from '../../../modules';
import { Trade } from '../../../modules/exchanges.types';
import { TradesMap } from '../../../modules/trades.types';
import { getExchanges } from '../../../selectors/selectGlobalState';

export const getManualTrades = (state: GlobalState): TradesMap => state.trades;

export const getAllTrades = createSelector(
  [getExchanges, getManualTrades],
  (exchanges, manualTrades): Trade[] => {
    const exchangeTrades: Trade[] = _.values(exchanges)
      .map(exchange => exchange.trades)
      .reduce((acc: Trade[], trades) => acc.concat(trades), []);

    return exchangeTrades.concat(_.values(manualTrades));
  }
);

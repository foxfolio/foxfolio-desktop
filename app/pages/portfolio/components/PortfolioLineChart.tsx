import { LinearProgress, withTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { WithTheme } from '@material-ui/core/styles/withTheme';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { bindActionCreators } from 'redux';

import * as _ from 'lodash';
import { Dispatch } from '../../../actions/actions.types';
import * as TickerActions from '../../../actions/ticker';
import { GlobalState } from '../../../reducers';
import { SettingsType } from '../../../reducers/settings';
import { History, HistoryData } from '../../../reducers/ticker';
import { getHistory, getSettings } from '../../../selectors/selectGlobalState';
import { Balances } from '../types/portfolio.types';
import { getHistoryEntry } from '../../../helpers/ticker';

interface StateProps {
  history: History;
  settings: SettingsType;
}

interface DispatchProps {
  requestHistoryForAll: (fsyms: string[], tsym: string) => void;
}

interface OwnProps {
  portfolio: Balances;
  sum: number;
}

export const ThemedPortfolioLineChart = withTheme()(
  class extends Component<StateProps & DispatchProps & OwnProps & WithTheme> {
    public componentWillMount() {
      const { requestHistoryForAll, portfolio, settings } = this.props;
      requestHistoryForAll(Object.keys(portfolio), settings.cryptoCurrency);
    }

    public render() {
      const { history, portfolio, sum, settings, theme } = this.props;

      const data = calculateHistoryForPortfolio(history, portfolio, settings.cryptoCurrency, sum);
      if (data.length > 0) {
        return (
          <ResponsiveContainer height={300}>
            <AreaChart data={data} margin={{ left: 40, top: 5, bottom: 5, right: 5 }}>
              <Area
                stroke={theme.palette.text.secondary}
                fill={theme.palette.divider}
                dataKey="value"
                isAnimationActive={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: theme.palette.text.secondary, strokeWidth: 0 }}
                tickFormatter={tick => moment.unix(tick).format('HH:mm')}
              />
              <YAxis
                interval="preserveStartEnd"
                tick={{ fill: theme.palette.text.secondary, strokeWidth: 0 }}
                tickFormatter={tick => tick.toPrecision(6)}
                domain={[dataMin => dataMin - 0.02 * dataMin, dataMax => dataMax + 0.02 * dataMax]}
              />
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
              <Tooltip
                itemStyle={{ color: theme.palette.text.secondary }}
                wrapperStyle={{ backgroundColor: theme.palette.background.paper }}
                labelFormatter={() => ''}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      } else {
        return <LinearProgress />;
      }
    }
  }
);

const calculateHistoryForPortfolio = (
  history: History,
  portfolio: Balances,
  tsym: string,
  sum: number
): Array<{ time: number; value: number }> => {
  _.mapValues(portfolio, balance => balance / sum);
  const mergedHistory: { [time: string]: number } = {};
  Object.keys(portfolio).forEach(fsym => {
    const data = getHistoryEntry(history, fsym, tsym).data;
    data.forEach(
      value =>
        (mergedHistory[value.time] =
          (mergedHistory[value.time] || 0) + value.close * portfolio[fsym])
    );
  });
  return _.entries(mergedHistory).map(pair => ({
    time: parseInt(pair[0], 10),
    value: pair[1] + (portfolio[tsym] || 0),
  }));
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, GlobalState> = state => ({
  history: getHistory(state),
  settings: getSettings(state),
});
const mapActionsToProps = (dispatch: Dispatch) => bindActionCreators(TickerActions, dispatch);

export const PortfolioLineChart = connect<StateProps, DispatchProps, OwnProps, GlobalState>(
  mapStateToProps,
  mapActionsToProps
)(ThemedPortfolioLineChart);

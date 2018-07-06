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

import { Dispatch } from '../actions/actions.types';
import * as TickerActions from '../actions/ticker';
import { getHistoryEntry } from '../helpers/ticker';
import { GlobalState } from '../reducers';
import { History } from '../reducers/ticker';

interface StateProps {
  history: History;
}

interface DispatchProps {
  requestHistory: (fsym: string, tsym: string) => void;
}

interface OwnProps {
  fsym: string;
  tsym: string;
}

export const ThemedTokenLineChart = withTheme()(
  class extends Component<StateProps & DispatchProps & OwnProps & WithTheme> {
    public componentWillMount() {
      const { requestHistory, fsym, tsym } = this.props;
      requestHistory(fsym, tsym);
    }

    public render() {
      const { history, fsym, tsym, theme } = this.props;

      const historyEntry = getHistoryEntry(history, fsym, tsym);
      if (fsym !== tsym && historyEntry.data.length > 0) {
        return (
          <ResponsiveContainer height={300}>
            <AreaChart data={historyEntry.data} margin={{ left: 40, top: 5, bottom: 5, right: 5 }}>
              <Area
                stroke={theme.palette.text.secondary}
                fill={theme.palette.divider}
                dataKey="close"
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
      } else if (fsym !== tsym) {
        return <LinearProgress />;
      }
      return (
        <div>
          No chart for currency pair {fsym}-{tsym}
        </div>
      );
    }
  }
);

const mapStateToProps: MapStateToProps<StateProps, OwnProps, GlobalState> = state => ({
  history: state.ticker.history,
});
const mapActionsToProps = (dispatch: Dispatch) =>
  bindActionCreators(TickerActions, dispatch);

export const TokenLineChart = connect<StateProps, DispatchProps, OwnProps, GlobalState>(
  mapStateToProps,
  mapActionsToProps
)(ThemedTokenLineChart);

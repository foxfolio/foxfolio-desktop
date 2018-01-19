// @flow
import React, { Component } from 'react';
import type { MapStateToProps } from 'react-redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { bindActionCreators } from 'redux';
import { LinearProgress, withTheme } from 'material-ui';
import * as TickerActions from '../actions/ticker';

type Props = {
  fsym: string,
  tsym: string,
  requestHistory: (fsym: string, tsym: string) => void,
  history: Object,
  theme: Object
};

class TokenLineChart_ extends Component<Props> {
  componentWillMount() {
    const { requestHistory, fsym, tsym } = this.props;
    requestHistory(fsym, tsym);
  }

  render() {
    const { history, fsym, tsym, theme } = this.props;

    if (fsym !== tsym && history[fsym] && history[fsym][tsym]) {
      const reducedHistory = history[fsym][tsym].data;
      return (
        <ResponsiveContainer height={300}>
          <AreaChart data={reducedHistory} margin={{ left: 40, top: 5, bottom: 5, right: 5 }}>
            <Area
              stroke={theme.palette.text.secondary}
              fill={theme.palette.text.divider}
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
              domain={[dataMin => dataMin - (0.02 * dataMin), dataMax => dataMax + (0.02 * dataMax)]}
            />
            <CartesianGrid stroke={theme.palette.text.divider} strokeDasharray="3 3"/>
            <Tooltip
              itemStyle={{ color: theme.palette.text.secondary }}
              wrapperStyle={{ backgroundColor: theme.palette.background.paper }}
              labelFormatter={() => ''}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else if (fsym !== tsym) {
      return <LinearProgress/>;
    }
    return <div>No chart for currency pair {fsym}-{tsym}</div>;
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  history: state.ticker.history,
});
const mapActionsToProps = (dispatch: Dispatch) => bindActionCreators(TickerActions, dispatch);

export const TokenLineChart = connect(mapStateToProps, mapActionsToProps)(withTheme()(TokenLineChart_));

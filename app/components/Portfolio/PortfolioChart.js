// @flow
import React from 'react';
import { defaults, HorizontalBar } from 'react-chartjs-2';
import { withTheme } from 'material-ui';
import { getTickerPrice } from '../../helpers/transactions';
import getColor from '../../utils/colors';

// Disable animating charts by default.
defaults.global.animation = false;

type Props = {
  ticker: Object,
  portfolio: Object,
  sum: number,
  theme: Object
};

function PortfolioChart({ ticker, portfolio, sum, theme }: Props) {
  const chartData = calculateChartData(ticker, portfolio, sum);

  return (
    <HorizontalBar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x',
          callbacks: {
            label: (item, data) => `${data.datasets[item.datasetIndex].label}: ${item.xLabel} %`,
          },
        },
        legend: {
          display: true,
          labels: {
            fontColor: theme.palette.text.secondary,
          },
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              fontColor: theme.palette.text.secondary,
              ticks: {
                min: 0,
                max: 100,
              },
            }],
          yAxes: [
            {
              stacked: true,
              fontColor: theme.palette.text.secondary,
            }],
        },
      }}
    />
  );
}

export default withTheme()(PortfolioChart);

function calculateChartData(ticker: Object, portfolio: Object, sum: number) {
  const datasets = Object.keys(portfolio)
    .filter(asset => portfolio[asset] > 0)
    .filter(asset => ticker[asset])
    .sort((a, b) =>
      (getTickerPrice(ticker, b, 'BTC') * portfolio[b]) - (getTickerPrice(ticker, a, 'BTC') * portfolio[a]))
    .map(asset => ({
      label: asset.toUpperCase(),
      backgroundColor: getColor(asset),
      borderColor: '#fff',
      borderWidth: 1,
      data: [((getTickerPrice(ticker, asset, 'BTC') * portfolio[asset] * 100) / sum).toFixed(2)],
    }));

  return { datasets };
}

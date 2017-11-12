// @flow
import React from 'react';
import { defaults, HorizontalBar } from 'react-chartjs-2';
import getColor from '../../utils/colors';

// Disable animating charts by default.
defaults.global.animation = false;

type Props = {
  ticker: Object,
  portfolio: Object,
  sum: number
};

export default function PortfolioChart({ ticker, portfolio, sum }: Props) {
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
        },
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              min: 0,
              max: 100,
            },
          }],
          yAxes: [{
            stacked: true,
          }],
        },
      }}
    />
  );
}

function calculateChartData(ticker: Object, portfolio: Object, sum: number) {
  const datasets = Object.keys(portfolio)
    .filter(asset => portfolio[asset] > 0)
    .filter(asset => ticker[asset])
    .sort((a, b) => (ticker[b].BTC.PRICE * portfolio[b]) - (ticker[a].BTC.PRICE * portfolio[a]))
    .map(asset => ({
      label: asset.toUpperCase(),
      backgroundColor: getColor(asset),
      borderColor: '#fff',
      borderWidth: 1,
      data: [((ticker[asset].BTC.PRICE * portfolio[asset] * 100) / sum).toFixed(2)],
    }));

  return { datasets };
}

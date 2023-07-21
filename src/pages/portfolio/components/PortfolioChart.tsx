import { WithTheme, withTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import chartjs, { ChartData, ChartTooltipItem } from 'chart.js';
import React from 'react';
import { defaults, HorizontalBar } from 'react-chartjs-2';
import { getTickerEntry } from '../../../helpers/ticker';
import { SettingsType } from '../../../modules/settings.types';
import { Ticker } from '../../../modules/ticker.types';
import getColor from '../../../utils/colors';

// Disable animating charts by default.
(defaults as any).global.animation = false;

interface Props {
  ticker: Ticker;
  portfolio: { [key: string]: number };
  settings: SettingsType;
  sum: number;
}

export const PortfolioChart = withTheme()(
  ({ ticker, portfolio, settings, sum, theme }: Props & WithTheme) => {
    const chartData = calculateChartData(ticker, portfolio, settings, sum, theme);

    return (
      <HorizontalBar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'x',
            callbacks: {
              label: labelCallback,
            },
          },
          legend: {
            display: true,
            labels: {
              fontColor: theme.palette.text.primary,
            },
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                gridLines: {
                  display: false,
                  color: theme.palette.text.secondary,
                },
                ticks: {
                  fontColor: theme.palette.text.primary,
                  min: 0,
                  max: 100,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
                gridLines: {
                  color: theme.palette.text.secondary,
                },
              },
            ],
          },
        }}
      />
    );
  }
);

function calculateChartData(
  ticker: Ticker,
  portfolio: { [key: string]: number },
  settings: SettingsType,
  sum: number,
  theme: Theme
): chartjs.ChartData {
  const { cryptoCurrency } = settings;

  const datasets = Object.keys(portfolio)
    .filter(asset => portfolio[asset] > 0)
    .filter(asset => ticker[asset])
    .sort(
      (a, b) =>
        getTickerEntry(ticker, b, cryptoCurrency).PRICE * portfolio[b] -
        getTickerEntry(ticker, a, cryptoCurrency).PRICE * portfolio[a]
    )
    .map(asset => ({
      label: asset.toUpperCase(),
      backgroundColor: getColor(asset),
      borderColor: theme.palette.background.default,
      borderWidth: 1,
      data: [
        {
          x: (
            getTickerEntry(ticker, asset, cryptoCurrency).PRICE *
            portfolio[asset] *
            100 /
            sum
          ).toFixed(2),
        },
      ],
    }));

  return { datasets };
}

const labelCallback = (item: ChartTooltipItem, data: ChartData) => {
  if (data && data.datasets && item && item.datasetIndex != null) {
    return `${data.datasets[item.datasetIndex].label}: ${item.xLabel} %`;
  }
  return '';
};

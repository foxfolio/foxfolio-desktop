import React, { Component } from 'react';

import { TableCell, TableRow } from 'material-ui';
import type { Trade, Transaction, Transfer } from '../reducers/transactions';

export default class TransactionRow extends Component {
  props: {
    transaction: Transaction
  };

  render() {
    const transaction = this.props.transaction;
    if (transaction.type === 'BUY' || transaction.type === 'SELL') {
      const trade = (transaction: Trade);
      return (
        <TableRow>
          <TableCell>{trade.date.toLocaleDateString()}</TableCell>
          <TableCell>{trade.source}</TableCell>
          <TableCell>{trade.market.major.toUpperCase()}-{trade.market.minor.toUpperCase()}</TableCell>
          <TableCell>{trade.type}</TableCell>
          <TableCell>{roundToDigits(trade.amount, 6)} {trade.market.minor.toUpperCase()}</TableCell>
          <TableCell>{roundToDigits(trade.rate, 6)} {trade.market.major.toUpperCase()}</TableCell>
        </TableRow>
      );
    }
    const transfer = (transaction: Transfer);
    return (
      <TableRow>
        <TableCell>{transfer.date.toLocaleDateString()}</TableCell>
        <TableCell>{transfer.source}</TableCell>
        <TableCell>{transfer.currency.toUpperCase()}</TableCell>
        <TableCell>{transfer.type}</TableCell>
        <TableCell>{roundToDigits(transfer.amount, 6)} {transfer.currency.toUpperCase()}</TableCell>
        <TableCell/>
      </TableRow>
    );
  }
}

function roundToDigits(number, digits) {
  return Math.round(number * (10 ** digits)) / (10 ** digits);
}

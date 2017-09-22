import React, { Component } from 'react';

import { TableCell, TableRow } from 'material-ui';

export default class TransactionRow extends Component {
  props: {
    data: {
      date: Date,
      type: string,
      fromCurr: string,
      toCurr: string,
      quantity: number,
      rate: number
    }
  };

  render() {
    const { date, type, fromCurr, toCurr, quantity, rate } = this.props.data;
    const sourceCurr = (type === 'buy' ? fromCurr : toCurr);
    const destCurr = (type === 'buy' ? toCurr : fromCurr);
    return (
      <TableRow>
        <TableCell>{date.toLocaleDateString()}</TableCell>
        <TableCell>{sourceCurr} <i className={`cc ${sourceCurr}`}/></TableCell>
        <TableCell>{destCurr} <i className={`cc ${destCurr}`}/></TableCell>
        <TableCell>{Math.round(quantity * 10000) / 10000}</TableCell>
        <TableCell>{rate.toFixed(6)} {fromCurr}</TableCell>
      </TableRow>
    );
  }
}

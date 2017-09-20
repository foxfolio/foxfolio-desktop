import React, { Component } from 'react';

import { TableRow, TableRowColumn } from 'material-ui';

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
        <TableRowColumn>{date.toLocaleDateString()}</TableRowColumn>
        <TableRowColumn>{sourceCurr} <i className={`cc ${sourceCurr}`}/></TableRowColumn>
        <TableRowColumn>{destCurr} <i className={`cc ${destCurr}`}/></TableRowColumn>
        <TableRowColumn>{Math.round(quantity * 10000) / 10000}</TableRowColumn>
        <TableRowColumn>{rate.toFixed(6)} {fromCurr}</TableRowColumn>
      </TableRow>
    );
  }
}

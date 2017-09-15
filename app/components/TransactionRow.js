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
        <TableRowColumn>{date.toLocaleString()}</TableRowColumn>
        <TableRowColumn><i className={`cc ${sourceCurr}`}/> {sourceCurr}</TableRowColumn>
        <TableRowColumn><i className={`cc ${destCurr}`}/> {destCurr}</TableRowColumn>
        <TableRowColumn>{quantity}</TableRowColumn>
        <TableRowColumn>{rate} {fromCurr}</TableRowColumn>
      </TableRow>
    );
  }
}

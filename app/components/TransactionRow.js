import React, { Component } from 'react';

import { TableCell, TableRow } from 'material-ui';
import type { transactionType } from '../reducers/transactions';

export default class TransactionRow extends Component {
  props: {
    data: transactionType
  };

  render() {
    const { date, source, outgoing, incoming, quantityIncoming, quantityOutgoing, rate } = this.props.data;
    return (
      <TableRow>
        <TableCell>{date.toLocaleDateString()}</TableCell>
        <TableCell>{source}</TableCell>
        <TableCell>{quantityOutgoing ? roundToSixDigits(quantityOutgoing) : ''} {outgoing} <i className={`cc ${outgoing}`}/></TableCell>
        <TableCell>{quantityIncoming ? roundToSixDigits(quantityIncoming) : ''} {incoming} <i className={`cc ${incoming}`}/></TableCell>
        <TableCell>{rate ? rate.toFixed(6) : ''} {rate ? outgoing : ''}</TableCell>
      </TableRow>
    );
  }
}

function roundToSixDigits(number) {
  return Math.round(number * 10000) / 10000;
}

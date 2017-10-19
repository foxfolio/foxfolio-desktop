import React, { Component } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from 'material-ui';
import TransactionRow from './TransactionRow';

type Props = {
  transactions: Transaction[]
}
export default class TransactionTable extends Component<Props> {

  render() {
    return (
      <Paper style={{ marginTop: 30, paddingTop: 10 }}>
        <h1 style={{ paddingLeft: 10 }}>Transactions</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Market / Currency</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.transactions.map(transaction => (
              <TransactionRow key={transaction.id} transaction={transaction}/>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

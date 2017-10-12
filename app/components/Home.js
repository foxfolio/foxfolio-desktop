// @flow
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableCell, TableHead, TableRow } from 'material-ui';
import TransactionRow from './TransactionRow';
import Portfolio from './Portfolio';

export default class Home extends Component {
  props: {
    fetchAllTransactions: () => void,
    transactions: any
  };

  componentDidMount() {
    const { fetchAllTransactions } = this.props;
    fetchAllTransactions();
  }

  render() {
    const transactions = flattenTransactions(this.props.transactions);

    return (
      <div className="container">
        <Portfolio transactions={transactions}/>
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
              {transactions.map(transaction => (
                <TransactionRow key={transaction.id} transaction={transaction}/>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

function flattenTransactions(transactions) {
  let flattenedTransactions = [];
  Object.keys(transactions)
    .forEach(key => {
      flattenedTransactions = flattenedTransactions
        .concat(transactions[key].trades).concat(transactions[key].transfers);
    });
  flattenedTransactions.sort((a, b) => b.date - a.date);
  return flattenedTransactions;
}

import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui';

import styles from './Home.css';
import TransactionRow from './TransactionRow';
import Portfolio from './Portfolio';

export default class Home extends Component {
  props: {
    getTransactions: () => void,
    transactions: any
  };

  componentDidMount() {
    const { getTransactions } = this.props;
    getTransactions();
  }

  render() {
    const { transactions } = this.props;

    return (
      <div className={styles.container}>
        <Portfolio transactions={transactions}/>
        <Paper style={{ marginTop: 30, padding: 10 }} zDepth={2}>
          <h1>Transactions</h1>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Source</TableHeaderColumn>
                <TableHeaderColumn>Destination</TableHeaderColumn>
                <TableHeaderColumn>Quantity</TableHeaderColumn>
                <TableHeaderColumn>Rate</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {transactions.map(transaction =>
                <TransactionRow key={transaction.id} data={transaction}/>)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

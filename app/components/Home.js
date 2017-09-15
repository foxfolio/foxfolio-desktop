import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Col, Grid, Row } from 'react-flexbox-grid';

import styles from './Home.css';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui';
import TransactionRow from './TransactionRow';
import BittrexTransactions from '../sources/bittrex';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
    };
  }

  componentDidMount() {
    BittrexTransactions()
      .then(res => this.setState({ transactions: res }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className={styles.container}>
        <Paper style={{ padding: 10 }} zDepth={2}>
          <h1>Portfolio</h1>
          <Grid fluid>
            <Row>
              <Col xs={1}><h3>XBT</h3></Col>
              <Col xs={1}><h4>1.541</h4></Col>
              <Col xsOffset={1} xs={1}><h3>ETH</h3></Col>
              <Col xs={1}><h4>10.215</h4></Col>
              <Col xsOffset={1} xs={1}><h3>XRP</h3></Col>
              <Col xs={1}><h4>150.510</h4></Col>
              <Col xsOffset={1} xs={1}><h3>OMG</h3></Col>
              <Col xs={1}><h4>15.642</h4></Col>
            </Row>
          </Grid>
        </Paper>
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
              {this.state.transactions.map(transaction =>
                <TransactionRow key={transaction.id} data={transaction}/>)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

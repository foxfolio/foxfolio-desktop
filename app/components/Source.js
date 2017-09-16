import React, { Component } from 'react';
import { Card, CardActions, CardHeader, FlatButton } from 'material-ui';
import style from './Source.css';

export default class Source extends Component {
  props: {
    source: {
      name: string,
      apiKey: string
    }
  };

  render() {
    const { name, apiKey } = this.props.source;
    return (
      <Card className={style.source}>
        <CardHeader
          title={name}
          subtitle={`Key: ${apiKey}`}
        />
        <CardActions>
          <FlatButton primary label="Edit"/>
        </CardActions>
      </Card>
    );
  }
}

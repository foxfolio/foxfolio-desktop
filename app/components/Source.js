import React, { Component } from 'react';
import { Card, CardActions, CardHeader, FlatButton } from 'material-ui';
import style from './Source.css';

export default class Source extends Component {
  props: {
    source: {
      name: string,
      apiKey: string
    },
    onEdit: () => void
  };

  render() {
    const { source, onEdit } = this.props;
    return (
      <Card className={style.source}>
        <CardHeader
          title={source.name}
          subtitle={`Key: ${source.apiKey}`}
        />
        <CardActions>
          <FlatButton primary label="Edit" onClick={onEdit(source)}/>
        </CardActions>
      </Card>
    );
  }
}

import React, { Component } from 'react';
import { BaseTable } from '../Grid/Table';
import Row from './Row';

export default class Table extends BaseTable {
  renderBody() {
    if (!this.props.data || !this.props.data.length) {
      return null;
    }

    return (
      <tbody>
      {this.props.data.map((row, idx) => {
        return (
          <Row
            key={'row-' + idx}
            row={row}
            columns={this.props.columns} />
        )
      })}
      </tbody>
    );
  }
}

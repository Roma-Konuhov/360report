import React, { Component } from 'react';
import Cell from '../Grid/Cell';
import { BaseRow } from '../Grid/Row';

class Row extends BaseRow {
  render() {
    return (
      <tr>
        {this.props.columns.map((col, idx) => {
          let className = col;
          className += this.props.row[col] >= 0 ? ' positive' : ' negative';
          return (<Cell key={'cell-' + idx} className={className} value={this.props.row[col]} />);
        })}
      </tr>
    );
  }
}

export default Row;
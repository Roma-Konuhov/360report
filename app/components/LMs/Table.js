import React, { Component } from 'react';
import { BaseTable } from '../Grid/Table';
import Row from './Row';
import RowWithDetails from './RowWithDetails';

export default class Table extends BaseTable {
  renderBody() {
    if (!this.props.data || !this.props.data.length) {
      return null;
    }

    return (
      <tbody>
      {this.props.data.map((row, idx) => {
        return row.selected ?
          <RowWithDetails
            key={'row-' + idx}
            row={row}
            columns={this.props.columns} />
          :
          <Row
            key={'row-' + idx}
            row={row}
            columns={this.props.columns} />
      })}
      </tbody>
    );
  }
}

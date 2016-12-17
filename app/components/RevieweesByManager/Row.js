import React from 'react';
import { BaseRow } from '../Grid/Row';
import Cell from '../Grid/Cell';
import { hashHistory } from 'react-router';

class Row extends BaseRow {
  onRowClick(row, e) {
    var pathname = '/manager/report/' + row.id;
    hashHistory.push(pathname);
  }

  render() {
    return (
      <tr onClick={this.onRowClick.bind(this, this.props.row)}>
        {this.props.columns.map((col, idx) => {
          return (<Cell key={'cell-' + idx} className={col} value={this.props.row[col]} />);
        })}
      </tr>
    );
  }
}


export default Row;
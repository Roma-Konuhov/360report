import React from 'react';
import { BaseRow } from '../Grid/Row';
import CellWithDetails from './CellWithDetails';

class RowWithDetails extends BaseRow {
  render() {
    if (this.props.row.active) {
      console.log('i am active  rowwith details', this.props.row.name)
    }

    return (
      <tr className="details">
        <CellWithDetails columns={this.props.columns} row={this.props.row} />
      </tr>
    );
  }
}

export default RowWithDetails;
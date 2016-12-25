import React from 'react';
import { BaseRow } from '../Grid/Row';
import CellWithDetails from './CellWithDetails';

class RowWithDetails extends BaseRow {
  render() {
    return (
      <tr className="details">
        <CellWithDetails columns={this.props.columns} row={this.props.row} />
      </tr>
    );
  }
}

export default RowWithDetails;
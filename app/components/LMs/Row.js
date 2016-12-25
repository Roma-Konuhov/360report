import React from 'react';
import { connect } from 'react-redux';
import { BaseRow } from '../Grid/Row';
import Cell from '../Grid/Cell';
import { toggleRowSelection } from '../../actions/appState';
import ExportButtonsBulk from '../ExportButtonsBulk';
import EmailButtonBulk from '../EmailButtonBulk';

class Row extends BaseRow {
  onRowClick(row, e) {
    e.preventDefault();
    this.props.toggleRowSelection(row.data._id);
  }

  render() {
    const { columns, row } = this.props;
    const classNames = row['active'] ? 'active' : '';

    return (
      <tr onClick={this.onRowClick.bind(this, row)} className={classNames}>
        {columns.map((col, idx) => {
          return (<Cell key={'cell-' + idx} className={col} value={row[col]} />);
        })}
        <td><ExportButtonsBulk id={row.data._id} entityType=""/></td>
        <td><EmailButtonBulk id={row.data._id} entityType=""/></td>
      </tr>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleRowSelection: (id) => dispatch(toggleRowSelection(id))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Row);
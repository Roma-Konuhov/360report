import React from 'react';
import { connect } from 'react-redux';
import { BaseRow } from '../Grid/Row';
import Cell from '../Grid/Cell';
import { toggleRowSelection } from '../../actions/appState';
import ExportButtonsBulk from '../ExportButtonsBulk';

class Row extends BaseRow {
  onRowClick(row, e) {
    e.preventDefault();
    this.props.toggleRowSelection(row.data._id);
  }

  render() {
    const { columns, row } = this.props;
    const classNames = row['active'] ? 'active' : '';
    if (row.active) {
      console.log('i am active ROw', row.name)
    }

    return (
      <tr onClick={this.onRowClick.bind(this, row)} className={classNames}>
        {columns.map((col, idx) => {
          return (<Cell key={'cell-' + idx} className={col} value={row[col]} />);
        })}
        <td><ExportButtonsBulk id={row.data._id} entityType="consultant"/></td>
        <td><ExportButtonsBulk id={row.data._id} entityType="manager"/></td>
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
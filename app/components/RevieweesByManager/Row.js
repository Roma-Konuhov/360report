import React from 'react';
import { BaseRow } from '../Grid/Row';
import Cell from '../Grid/Cell';

class Row extends BaseRow {
  onRowClick(row, e) {
    console.log(row.id)
    var pathname = '/manager/report/' + row.id;
    this.context.router.push({ pathname: pathname });
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

Row.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default Row;
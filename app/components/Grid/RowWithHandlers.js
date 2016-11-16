import React from 'react';
import Router from 'react-router';
import Row from './Row';
import Cell from './Cell';

class RowWithHandlers extends Row {
  constructor(props) {
    super(props);
  }

  onRowClick(row, e) {
    var pathname = '/report/' + row.id;
    this.context.router.push({ pathname: pathname });
  }

  render() {
    return (
      <tr onClick={this.onRowClick.bind(this, this.props.row)}>
        {this.props.columns.map((col, idx) => {
          return (<Cell key={'cell-' + idx} value={this.props.row[col]} />);
        })}
      </tr>
    );
  }
}

RowWithHandlers.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default RowWithHandlers;
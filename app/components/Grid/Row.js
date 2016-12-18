import React, { Component } from 'react';
import Cell from './Cell';

class Row extends Component {
  render() {
    return (
      <tr>
        {this.props.columns.map((col, idx) => {
          return (<Cell key={'cell-' + idx} className={col} value={this.props.row[col]} />);
        })}
      </tr>
    );
  }
}

Row.propTypes = {
  row: React.PropTypes.object.isRequired,
  columns: React.PropTypes.array.isRequired,
};

export default Row;
export { Row as BaseRow };
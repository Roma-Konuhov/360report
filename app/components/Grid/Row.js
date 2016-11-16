import React, { Component } from 'react';
import _ from 'lodash';
import Cell from './Cell';

class Row extends Component {
  render() {
    return (
      <tr>
        {this.props.columns.map((col, idx) => {
          return (<Cell key={'cell-' + idx} value={this.props.row[col]} />);
        })}
      </tr>
    );
  }
}

Row.defaultProps = {
  onRowClick: _.identity
};

Row.propTypes = {
  row: React.PropTypes.object.isRequired,
  columns: React.PropTypes.array.isRequired,
};

export default Row;
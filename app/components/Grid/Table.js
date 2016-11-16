import React, { Component } from 'react';
import _ from 'lodash';
import RowWithHandlers from './RowWithHandlers';

class Table extends Component {
  constructor(props) {
    super(props);
  }

  renderHeader() {
    return (
      <thead>
      <tr>
        {this.props.columns.map((column, idx) => {
          return (<th key={idx}>{this.props.propsDbToScreenMap[column]}</th>);
        })}
      </tr>
      </thead>
    );
  }

  renderBody() {
    return (
      <tbody>
      {this.props.data.map((row, idx) => {
        return (
          <RowWithHandlers
            key={'row-' + idx}
            row={row}
            columns={this.props.columns} />
        )
      })}
      </tbody>
    );
  }

  render() {
    return (
      <div className="container">
        <table className="data-table table table-hover">
          {this.renderHeader()}
          {this.renderBody()}
        </table>
      </div>
    );
  }
}

export default Table;
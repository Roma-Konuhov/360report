import React, { Component } from 'react';
import _ from 'lodash';

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
          <tr key={'row-' + idx} onClick={this.props.onRowClick.bind(this, row, idx)}>
            {this.props.columns.map((col, idx) => {
              return (<td key={'col-' + idx}>{row[col]}</td>);
            })}
          </tr>
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

Table.defaultProps = {
  onRowClick: _.identity
};

export default Table;
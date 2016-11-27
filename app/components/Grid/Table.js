import React, { Component } from 'react';
import Row from './Row';

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
    if (!this.props.data || !this.props.data.length) {
      return null;
    }

    return (
      <tbody>
      {this.props.data.map((row, idx) => {
        return (
          <Row
            key={'row-' + idx}
            row={row}
            columns={this.props.columns} />
        )
      })}
      </tbody>
    );
  }

  render() {
    let styles = 'data-table table';
    if (this.props.hoverable) {
      styles += ' table-hover';
    }

    return (
      <table className={styles}>
        {this.renderHeader()}
        {this.renderBody()}
      </table>
    );
  }
}

Table.propTypes = {
  data: React.PropTypes.array,
  columns: React.PropTypes.array,
  propsDbToScreenMap: React.PropTypes.object,
  hoverable: React.PropTypes.bool
};

Table.defaultProps = {
  hoverable: false
};

export default Table;
export {Table as BaseTable};
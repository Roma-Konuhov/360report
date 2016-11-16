import React, { Component } from 'react';
import _ from 'lodash';

class Cell extends Component {
  render() {
    return (<td idx={'cell' + this.props.idx}>{this.props.value}</td>);
  }
}

Cell.propTypes = {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string.isRequired,
    React.PropTypes.number.isRequired
  ])
};

export default Cell;
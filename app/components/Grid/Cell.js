import React, { Component } from 'react';
import _ from 'lodash';

class Cell extends Component {
  render() {
    return (<td className={this.props.className || ''}>{this.props.value}</td>);
  }
}

Cell.propTypes = {
  className: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string.isRequired,
    React.PropTypes.number.isRequired
  ])
};

export default Cell;
export { Cell as BaseCell };
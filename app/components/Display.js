import React from 'react';
import _ from 'lodash';

class Display extends React.Component {
  render() {
    if (this.props.inline) {
      return !_.isEmpty(this.props.if) ? (<span>{this.props.children}</span>) : null;
    } else if (this.props.nowrap) {
      return !_.isEmpty(this.props.if) ? this.props.children : null;
    } else {
      return !_.isEmpty(this.props.if) ? (<div>{this.props.children}</div>) : null;
    }
  }
}

export default Display;
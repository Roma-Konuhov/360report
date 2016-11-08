import React from 'react';
import _ from 'lodash';

class Display extends React.Component {
  render() {
    if (!(this.props.if instanceof Object) && this.props.if ||
      (this.props.if instanceof Object) && !_.isEmpty(this.props.if) ) {
      if (this.props.inline) {
        return (<span>{this.props.children}</span>);
      } else if (this.props.nowrap) {
        return this.props.children
      } else {
        return (<div>{this.props.children}</div>);
      }
    } else {
      return null;
    }
  }
}

export default Display;
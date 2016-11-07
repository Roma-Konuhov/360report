import React from 'react';

class Display extends React.Component {
  render() {
    if (this.props.inline) {
      return this.props.if ? (<span>{this.props.children}</span>) : null;
    } else {
      return this.props.if ? (<div>{this.props.children}</div>) : null;
    }
  }
}

export default Display;
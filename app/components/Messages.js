import React from 'react';

class Messages extends React.Component {
  render() {
    return this.props.messages.success ? (
      <div role="alert" className="alert alert-success fade-out">
        {this.props.messages.success.map((message, index) => <div key={index}>{message}</div>)}
      </div>
    ) : this.props.messages.error ? (
      <div role="alert" className="alert alert-danger fade-out">
        {this.props.messages.error.map((message, index) => <div key={index}>{message}</div>)}
      </div>
    ) : this.props.messages.info ? (
      <div role="alert" className="alert alert-info fade-out">
        {this.props.messages.info.map((message, index) => <div key={index}>{message}</div>)}
      </div>
    ) : null;
  }
}

export default Messages;

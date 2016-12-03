import React from 'react';

class Messages extends React.Component {
  handleClose(e) {
    e.target.parentNode.style.display = 'none';
  }

  render() {
    return this.props.messages.success ? (
      <div role="alert" className="alert alert-success fade-out">
        <div className="close" onClick={this.handleClose}></div>
        {this.props.messages.success.map((message, index) => <div key={index}>{message}</div>)}
      </div>
    ) : this.props.messages.error ? (
      <div role="alert" className="alert alert-danger fade-out fly">
        <div className="close" onClick={this.handleClose}></div>
        {this.props.messages.error.map((message, index) => <div key={index}>{message}</div>)}
      </div>
    ) : this.props.messages.info ? (
      <div role="alert" className="alert alert-info fade-out">
        <div className="close" onClick={this.handleClose}></div>
        {this.props.messages.info.map((message, index) => <div key={index}>{message}</div>)}
      </div>
    ) : null;
  }
}

export default Messages;

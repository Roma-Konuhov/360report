import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.messageStorage = {};
    this.timer = null;
  }

  handleClose(key) {
    this.messageStorage = _.omit(this.messageStorage, key);
    clearTimeout(this.timer);
    this.props.dispatch({type: 'CLEAR_MESSAGES'});
  }

  componentWillUpdate(nextProps) {
    if (_.isEmpty(nextProps.messages)) {
      return;
    }
    var key = Object.keys(nextProps.messages)[0];

    this.timer = setTimeout(function(key) {
      this.handleClose(key);
    }.bind(this, key), 5000);

    if (this.messageStorage[key]) {
      this.messageStorage[key] = this.messageStorage[key].concat(nextProps.messages[key]);
    } else {
      this.messageStorage[key] = nextProps.messages[key];
    }
  }

  renderMessages(messageStorage) {
    return _.map(messageStorage, (messages, key) => {
        switch (key) {
          case 'success':
            return (
              <div role="alert" className="alert alert-success">
                <div className="close" onClick={this.handleClose.bind(this, 'success')}></div>
                {messages.map((message, index) => <div key={index}>{message}</div>)}
              </div>
            );
          case 'error':
            return (
              <div role="alert" className="alert alert-danger">
                <div className="close" onClick={this.handleClose.bind(this, 'error')}></div>
                {messages.map((message, index) => <div key={index}>{message}</div>)}
              </div>
            );
          case 'info':
            return (
              <div role="alert" className="alert alert-info">
                <div className="close" onClick={this.handleClose.bind(this, 'info')}></div>
                {messages.map((message, index) => <div key={index}>{message}</div>)}
              </div>
            );
          default:
            return null;
        }
      });
  }

  render() {
    return !_.isEmpty(this.messageStorage) ? (
      <div className="message-container">
        {this.renderMessages(this.messageStorage)}
      </div>)
    : null;
  }
}

export default connect()(Messages);

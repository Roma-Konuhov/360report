import React from 'react';

class Error extends React.PureComponent {
  render() {
    return (
      <div className="error fade-out">
        {this.props.error.message}
      </div>
    );
  }
}

React.propTypes = {
  error: React.PropTypes.object.isRequired
};

export default Error;
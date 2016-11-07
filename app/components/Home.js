import React from 'react';
import { connect } from 'react-redux'
import FileUploader from './FileUploader';
import Messages from './Messages';

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <Messages messages={this.props.messages}/>
        <FileUploader label="Report (csv file)" />
        <FileUploader label="People (csv file)" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Home);

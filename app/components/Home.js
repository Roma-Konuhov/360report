import React from 'react';
import { connect } from 'react-redux'
import FileUploadContainer from './FileUploadContainer';
import Messages from './Messages';

class Home extends React.Component {


  render() {
    return (
      <div className="container">
        <Messages messages={this.props.messages}/>
        <FileUploadContainer {...this.props} />
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

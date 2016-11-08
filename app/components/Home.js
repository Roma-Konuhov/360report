import React from 'react';
import { connect } from 'react-redux'
import FileUploader from './FileUploader';
import Messages from './Messages';

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <Messages messages={this.props.messages}/>
        <FileUploader label="Consultant report (csv file)" name="consultant_report" />
        <FileUploader label="Manager report (csv file)" name="manager_report" />
        <FileUploader label="People relations (csv file)" name="people_relations" />
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
